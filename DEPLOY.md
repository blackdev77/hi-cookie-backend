# 🚀 Deploy no Vercel — Passo a Passo (24/7 Grátis)

## Pré-requisitos

### 1. Instalar o Git
Baixe e instale: **https://git-scm.com/download/win**
- Na instalação, deixe tudo padrão
- **Feche e abra o terminal depois de instalar**

### 2. Criar conta no GitHub
Acesse: **https://github.com** e crie uma conta

### 3. Criar conta no Vercel
Acesse: **https://vercel.com** e faça login com GitHub

---

## Passo a Passo

### Passo 1 — Configurar o Git (só na primeira vez)
```powershell
cd "c:\Users\Gustavo\Desktop\Hi cookies lem"
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

### Passo 2 — Inicializar e commit
```powershell
git init
git add .
git commit -m "Hi Cookie - Backend API"
```

### Passo 3 — Criar repositório no GitHub
1. Acesse **https://github.com/new**
2. Nome: `hi-cookie-backend`
3. Deixe **Público**
4. **NÃO** marque "Add a README"
5. Clique **Create repository**

### Passo 4 — Enviar para o GitHub
```powershell
git remote add origin https://github.com/SEU_USUARIO/hi-cookie-backend.git
git branch -M main
git push -u origin main
```

### Passo 5 — Deploy no Vercel
1. Acesse **https://vercel.com/new**
2. Selecione **Import Git Repository**
3. Escolha `hi-cookie-backend`
4. Clique **Deploy**
5. Aguarde ~1 minuto

### Passo 6 — Pronto! 🎉
Sua API estará online 24/7 em:
```
https://hi-cookie-backend.vercel.app
```

Teste:
```
https://hi-cookie-backend.vercel.app/            → Frontend de teste
https://hi-cookie-backend.vercel.app/api/products → API de produtos
https://hi-cookie-backend.vercel.app/images/06-pokemon.jpg → Imagens
```

---

## ✅ Vantagens do Vercel (Grátis)
- ⚡ Online **24/7** (sem dormir!)
- 🌍 CDN global (rápido no mundo todo)
- 🔒 HTTPS automático
- 📦 100GB de banda/mês
- 🔄 Deploy automático a cada push no GitHub
