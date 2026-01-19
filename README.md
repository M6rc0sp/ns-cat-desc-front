# NS Category Description Frontend

Interface React + TypeScript para gerenciar descrições de categorias com editor WYSIWYG.

![License](https://img.shields.io/badge/license-MIT-blue)

## Configuração

### Variáveis de Ambiente

```bash
cp .env.example .env
```

Configure no `.env`:

```dotenv
# URL do microserviço (será configurada no deployment)
VITE_API_URL=http://localhost:8000/

# Ambiente
VITE_APP_ENV=development
```

### Instalação

```bash
# Instalar dependências
npm install

# Desenvolvimento (Vite)
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## Deploy

Este frontend é agnóstico quanto ao domínio. Configure `VITE_API_URL` para apontar para seu servidor.

**Exemplo com Vercel ou similar:**

```bash
VITE_API_URL=https://api.seu-dominio.com/ npm run build
```

## Stack

- React 18+
- TypeScript
- Vite
- CSS Modules

## Autor

Nexos App

## License

This repository is available as open-source under the terms of the [MIT License](https://opensource.org/license/mit/). Be sure to review and comply with the license guidelines when using this code.
