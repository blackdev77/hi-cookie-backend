const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// ─── Middleware ───────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(express.json());

// ─── Carregar dados ──────────────────────────────────────
function loadData() {
  const raw = fs.readFileSync(path.join(__dirname, '..', 'data', 'products.json'), 'utf-8');
  return JSON.parse(raw);
}

// ─── ROTAS DA API ────────────────────────────────────────

// GET /api — Documentação
app.get('/api', (req, res) => {
  res.json({
    name: '🍪 Hi Cookie API',
    version: '1.0.0',
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

// GET /api/store
app.get('/api/store', (req, res) => {
  const data = loadData();
  res.json({ success: true, data: data.store });
});

// GET /api/categories
app.get('/api/categories', (req, res) => {
  const data = loadData();
  res.json({ success: true, data: data.categories, total: data.categories.length });
});

// GET /api/categories/:id
app.get('/api/categories/:id', (req, res) => {
  const data = loadData();
  const category = data.categories.find(c => c.id === req.params.id);
  if (!category) return res.status(404).json({ success: false, error: 'Categoria não encontrada' });
  const products = data.products.filter(p => p.category === req.params.id);
  res.json({ success: true, data: { ...category, products }, total: products.length });
});

// GET /api/products
app.get('/api/products', (req, res) => {
  const data = loadData();
  let products = [...data.products];

  if (req.query.category) products = products.filter(p => p.category === req.query.category);
  if (req.query.featured === 'true') products = products.filter(p => p.featured === true);
  if (req.query.tag) {
    const tag = req.query.tag.toLowerCase();
    products = products.filter(p => p.tags.some(t => t.toLowerCase().includes(tag)));
  }
  if (req.query.search) {
    const s = req.query.search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(s) ||
      p.shortName.toLowerCase().includes(s) ||
      p.description.toLowerCase().includes(s) ||
      p.tags.some(t => t.toLowerCase().includes(s))
    );
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || products.length;
  const start = (page - 1) * limit;
  const paginated = products.slice(start, start + limit);

  res.json({ success: true, data: paginated, total: products.length, page, totalPages: Math.ceil(products.length / limit) });
});

// GET /api/products/featured
app.get('/api/products/featured', (req, res) => {
  const data = loadData();
  const featured = data.products.filter(p => p.featured);
  res.json({ success: true, data: featured, total: featured.length });
});

// GET /api/products/:slug
app.get('/api/products/:slug', (req, res) => {
  const data = loadData();
  const product = data.products.find(p => p.slug === req.params.slug);
  if (!product) return res.status(404).json({ success: false, error: 'Produto não encontrado' });
  const related = data.products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  res.json({ success: true, data: { ...product, related } });
});

// GET /api/tags
app.get('/api/tags', (req, res) => {
  const data = loadData();
  const tags = [...new Set(data.products.flatMap(p => p.tags))].sort();
  res.json({ success: true, data: tags, total: tags.length });
});

// GET /api/occasions
app.get('/api/occasions', (req, res) => {
  const data = loadData();
  const occasions = [...new Set(data.products.map(p => p.occasion))].sort();
  res.json({ success: true, data: occasions, total: occasions.length });
});

module.exports = app;
