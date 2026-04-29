const API = window.location.origin;
let allProducts = [], categories = [], activeFilter = 'all';

async function init() {
  try {
    const [catRes, prodRes] = await Promise.all([
      fetch(`${API}/api/categories`).then(r => r.json()),
      fetch(`${API}/api/products`).then(r => r.json())
    ]);
    categories = catRes.data;
    allProducts = prodRes.data;
    renderCategories();
    renderFilters();
    renderGallery(allProducts);
    setupScrollAnimations();
    setHeroImage();
  } catch (e) {
    document.getElementById('gallery-grid').innerHTML = '<p style="text-align:center;color:#7A6565;grid-column:1/-1;padding:60px 20px">Não foi possível carregar os produtos. Verifique se a API está rodando.</p>';
  }
}

function setHeroImage() {
  const featured = allProducts.filter(p => p.featured);
  if (featured.length && document.getElementById('hero-img')) {
    const rand = featured[Math.floor(Math.random() * featured.length)];
    document.getElementById('hero-img').src = rand.image;
    document.getElementById('hero-img').alt = rand.shortName;
  }
}

function renderCategories() {
  const el = document.getElementById('cat-grid');
  if (!el) return;
  el.innerHTML = categories.map(c => {
    const count = allProducts.filter(p => p.category === c.id).length;
    return `<div class="cat-card reveal" data-cat="${c.id}" onclick="filterByCategory('${c.id}')">
      <div class="cat-icon">${c.icon}</div>
      <h3>${c.name}</h3>
      <p>${count} produto${count > 1 ? 's' : ''}</p>
    </div>`;
  }).join('');
}

function renderFilters() {
  const el = document.getElementById('gallery-filters');
  if (!el) return;
  let html = '<button class="filter-btn active" onclick="filterProducts(\'all\',this)">Todos</button>';
  html += '<button class="filter-btn" onclick="filterProducts(\'featured\',this)">⭐ Destaques</button>';
  categories.forEach(c => {
    html += `<button class="filter-btn" onclick="filterProducts('${c.id}',this)">${c.icon} ${c.name}</button>`;
  });
  el.innerHTML = html;
}

function filterProducts(cat, btn) {
  activeFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  let filtered = allProducts;
  if (cat === 'featured') filtered = allProducts.filter(p => p.featured);
  else if (cat !== 'all') filtered = allProducts.filter(p => p.category === cat);
  renderGallery(filtered);
}

function filterByCategory(catId) {
  const section = document.getElementById('galeria');
  if (section) section.scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(b => b.classList.remove('active'));
    const idx = categories.findIndex(c => c.id === catId) + 2;
    if (btns[idx]) btns[idx].classList.add('active');
    activeFilter = catId;
    renderGallery(allProducts.filter(p => p.category === catId));
  }, 400);
}

function renderGallery(products) {
  const el = document.getElementById('gallery-grid');
  if (!el) return;
  if (!products.length) {
    el.innerHTML = '<p style="text-align:center;color:#7A6565;grid-column:1/-1;padding:60px">Nenhum produto nesta categoria.</p>';
    return;
  }
  el.innerHTML = products.map((p, i) => `
    <div class="product-card" onclick="openModal('${p.slug}')" style="transition-delay:${i * .06}s">
      <div class="card-img">
        <img src="${p.image}" alt="${p.shortName}" loading="lazy">
        <div class="card-overlay"><span>Ver detalhes</span></div>
      </div>
      <div class="card-body">
        <div class="card-occasion">${p.occasion}</div>
        <h3>${p.name}</h3>
        <p>${p.description}</p>
      </div>
      <div class="card-footer">
        ${p.tags.slice(0, 3).map(t => `<span class="card-tag">${t}</span>`).join('')}
      </div>
    </div>`).join('');
  requestAnimationFrame(() => {
    document.querySelectorAll('.product-card').forEach((c, i) => {
      setTimeout(() => c.classList.add('visible'), i * 80);
    });
  });
}

function openModal(slug) {
  const p = allProducts.find(pr => pr.slug === slug);
  if (!p) return;
  const m = document.getElementById('modal');
  document.getElementById('modal-img').src = p.image;
  document.getElementById('modal-img').alt = p.name;
  document.getElementById('modal-title').textContent = p.name;
  document.getElementById('modal-occasion').textContent = p.occasion;
  document.getElementById('modal-desc').textContent = p.longDescription || p.description;
  document.getElementById('modal-min').textContent = `Pedido mínimo: ${p.minOrder} unidades`;
  const techEl = document.getElementById('modal-tech');
  techEl.innerHTML = (p.techniques || []).map(t => `<span>${t}</span>`).join('');
  m.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Scroll animations
function setupScrollAnimations() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// Navbar scroll
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.nav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
});

document.addEventListener('DOMContentLoaded', init);
