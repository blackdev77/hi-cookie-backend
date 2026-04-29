# 🍪 Hi Cookie — Backend API

## Sobre
API REST para o site da **Hi Cookie**, loja de cookies decorados artesanais.
Backend feito com **Node.js + Express**.

## Como rodar

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento (com hot reload)
npm run dev

# Rodar em produção
npm start
```

A API roda em: **http://localhost:3001**

---

## 📡 Endpoints da API

### Informações da Loja
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/store` | Dados da loja (nome, descrição, contato) |

### Categorias
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/categories` | Todas as categorias |
| GET | `/api/categories/:id` | Categoria + seus produtos |

### Produtos
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/products` | Todos os produtos (com filtros) |
| GET | `/api/products/featured` | Só produtos em destaque |
| GET | `/api/products/:slug` | Produto específico + relacionados |

### Extras
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/tags` | Todas as tags únicas |
| GET | `/api/occasions` | Todas as ocasiões |
| GET | `/images/:filename` | Imagem estática do cookie |

---

## 🔎 Filtros e Busca (query params em `/api/products`)

| Parâmetro | Exemplo | Descrição |
|-----------|---------|-----------|
| `category` | `?category=batizado` | Filtrar por categoria |
| `featured` | `?featured=true` | Só destaques |
| `tag` | `?tag=disney` | Buscar por tag |
| `search` | `?search=pokemon` | Buscar no nome, descrição e tags |
| `page` | `?page=1` | Paginação - página |
| `limit` | `?limit=6` | Paginação - itens por página |

### Exemplos de chamada:
```
GET /api/products?category=personagens
GET /api/products?featured=true&limit=4
GET /api/products?search=disney
GET /api/products?tag=menina&page=1&limit=6
```

---

## 📂 Estrutura do Projeto

```
Hi cookies lem/
├── server.js              ← Servidor Express com todas as rotas
├── package.json           ← Dependências do projeto
├── README.md              ← Este arquivo
├── data/
│   ├── products.json      ← Banco de dados JSON (loja, categorias, 15 produtos)
│   └── images/            ← Imagens dos cookies
│       ├── 01-cha-de-bebe-bonequinha.jpg
│       ├── 02-monograma-borboletas.jpg
│       ├── 03-corrida-carrinhos.jpg
│       ├── 04-batizado-ovelhinha.jpg
│       ├── 05-bela-e-a-fera.jpg
│       ├── 06-pokemon.jpg
│       ├── 07-cha-bebe-completo.jpg
│       ├── 08-limao-siciliano.jpg
│       ├── 09-patrulha-canina.jpg
│       ├── 10-jardim-encantado.jpg
│       ├── 11-circo-magico.jpg
│       ├── 12-batizado-mensagens.jpg
│       ├── 13-jesus-religioso.jpg
│       ├── 14-fundo-do-mar.jpg
│       └── 15-mickey-cowboy.jpg
```

---

## 🎨 Para o Frontend

### Exemplo com fetch:
```javascript
// Buscar todos os produtos
const res = await fetch('http://localhost:3001/api/products');
const { data, total } = await res.json();

// Buscar produtos em destaque
const res = await fetch('http://localhost:3001/api/products/featured');
const { data } = await res.json();

// Buscar por categoria
const res = await fetch('http://localhost:3001/api/products?category=batizado');
const { data } = await res.json();

// Buscar produto específico
const res = await fetch('http://localhost:3001/api/products/pokemon');
const { data } = await res.json();
// data.related → produtos relacionados

// Carregar imagem
// <img src="http://localhost:3001/images/06-pokemon.jpg" />
```

### Resposta padrão:
```json
{
  "success": true,
  "data": [...],
  "total": 15,
  "page": 1,
  "totalPages": 1
}
```

---

## 📋 Categorias disponíveis

| ID | Nome | Qtd |
|----|------|-----|
| `cha-de-bebe` | Chá de Bebê & 1º Aninho | 4 |
| `batizado` | Batizado & Religioso | 3 |
| `aniversario` | Aniversário Infantil | 2 |
| `personagens` | Personagens & Licenciados | 4 |
| `tematicos` | Temáticos & Especiais | 2 |
