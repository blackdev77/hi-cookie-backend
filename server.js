const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ───────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos (imagens + frontend)
app.use(express.static(path.join(__dirname, 'public')));

// ─── Carregar dados ──────────────────────────────────────
function loadData() {
  const raw = fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf-8');
  return JSON.parse(raw);
}

// ─── Importar rotas da API ───────────────────────────────
const api = require('./api/index');
app.use(api);

// ─── Iniciar servidor ────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  🍪 ══════════════════════════════════════');
  console.log('  🍪  Hi Cookie API');
  console.log(`  🍪  Rodando em: http://localhost:${PORT}`);
  console.log(`  🍪  Frontend:   http://localhost:${PORT}/`);
  console.log('  🍪 ══════════════════════════════════════');
  console.log('');
});
