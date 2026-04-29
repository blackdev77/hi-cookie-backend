const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// ─── Cache de dados em memória ───────────────────────────
let cachedData = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60000; // 1 minuto

function loadData() {
  const now = Date.now();
  if (cachedData && (now - cacheTimestamp) < CACHE_TTL) {
    return cachedData;
  }
  const raw = fs.readFileSync(path.join(__dirname, '..', 'data', 'products.json'), 'utf-8');
  cachedData = JSON.parse(raw);
  cacheTimestamp = now;
  return cachedData;
}

// ─── Sanitização de input ────────────────────────────────
function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>'"&]/g, '').trim().slice(0, 200);
}

// ─── ROTAS DA API ────────────────────────────────────────

app.get('/api', (req, res) => {
  res.json({
    name: 'Hi Cookie API',
    version: '1.1.0',
    endpoints: {
      store: 'GET /api/store',
      categories: 'GET /api/categories',
      categoryById: 'GET /api/categories/:id',
      products: 'GET /api/products',
      productBySlug: 'GET /api/products/:slug',
      featuredProducts: 'GET /api/products/featured',
      tags: 'GET /api/tags',
      occasions: 'GET /api/occasions'
    },
    filters: {
      byCategory: '/api/products?category=batizado',
      byFeatured: '/api/products?featured=true',
      byTag: '/api/products?tag=disney',
      bySearch: '/api/products?search=pokemon',
      withPagination: '/api/products?page=1&limit=6'
    }
  });
});

app.get('/api/store', (req, res) => {
  const data = loadData();
  res.json({ success: true, data: data.store });
});

app.get('/api/categories', (req, res) => {
  const data = loadData();
  res.json({ success: true, data: data.categories, total: data.categories.length });
});

app.get('/api/categories/:id', (req, res) => {
  const data = loadData();
  const id = sanitize(req.params.id);
  const category = data.categories.find(c => c.id === id);
  if (!category) return res.status(404).json({ success: false, error: 'Categoria não encontrada' });
  const products = data.products.filter(p => p.category === id);
  res.json({ success: true, data: { ...category, products }, total: products.length });
});

app.get('/api/products', (req, res) => {
  const data = loadData();
  let products = [...data.products];

  if (req.query.category) products = products.filter(p => p.category === sanitize(req.query.category));
  if (req.query.featured === 'true') products = products.filter(p => p.featured === true);
  if (req.query.tag) {
    const tag = sanitize(req.query.tag).toLowerCase();
    products = products.filter(p => p.tags.some(t => t.toLowerCase().includes(tag)));
  }
  if (req.query.search) {
    const s = sanitize(req.query.search).toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(s) ||
      p.shortName.toLowerCase().includes(s) ||
      p.description.toLowerCase().includes(s) ||
      p.tags.some(t => t.toLowerCase().includes(s))
    );
  }

  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || products.length));
  const start = (page - 1) * limit;
  const paginated = products.slice(start, start + limit);

  res.json({ success: true, data: paginated, total: products.length, page, totalPages: Math.ceil(products.length / limit) });
});

// IMPORTANTE: featured ANTES de :slug para evitar conflito de rota
app.get('/api/products/featured', (req, res) => {
  const data = loadData();
  const featured = data.products.filter(p => p.featured);
  res.json({ success: true, data: featured, total: featured.length });
});

app.get('/api/products/:slug', (req, res) => {
  const data = loadData();
  const slug = sanitize(req.params.slug);
  const product = data.products.find(p => p.slug === slug);
  if (!product) return res.status(404).json({ success: false, error: 'Produto não encontrado' });
  const related = data.products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  res.json({ success: true, data: { ...product, related } });
});

app.get('/api/tags', (req, res) => {
  const data = loadData();
  const tags = [...new Set(data.products.flatMap(p => p.tags))].sort();
  res.json({ success: true, data: tags, total: tags.length });
});

app.get('/api/occasions', (req, res) => {
  const data = loadData();
  const occasions = [...new Set(data.products.map(p => p.occasion))].sort();
  res.json({ success: true, data: occasions, total: occasions.length });
});

module.exports = app;
