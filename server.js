const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Segurança ───────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: false
}));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Muitas requisições. Tente novamente em 15 minutos.' }
}));

// ─── CORS ────────────────────────────────────────────────
app.use((req, res, next) => {
  const allowed = process.env.ALLOWED_ORIGINS || '*';
  res.setHeader('Access-Control-Allow-Origin', allowed);
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json());

// ─── Arquivos estáticos ──────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ─── Rotas da API ────────────────────────────────────────
const api = require('./api/index');
app.use(api);

// ─── Fallback: SPA support ──────────────────────────────
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

// ─── Iniciar servidor ────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  🍪 ══════════════════════════════════════');
  console.log('  🍪  Hi Cookie API v1.1.0');
  console.log(`  🍪  Rodando em: http://localhost:${PORT}`);
  console.log('  🍪  Segurança: Helmet + Rate Limit ativo');
  console.log('  🍪 ══════════════════════════════════════');
  console.log('');
});
