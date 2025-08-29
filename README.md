# TerrraMail - Secure Processing Platform

Uma plataforma segura de processamento de dados com controle de IP e painel administrativo.

## Funcionalidades

- 🔐 Sistema de autenticação seguro
- 👥 Gerenciamento de usuários com MongoDB
- 🛡️ Proteção por IP e sistema de banimento
- 📊 Dashboard com estatísticas em tempo real
- ⚙️ Painel administrativo completo
- 🚀 Processamento de dados em lote

## Configuração

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar MongoDB
Certifique-se de ter o MongoDB rodando localmente ou configure uma conexão remota.

### 3. Configurar variáveis de ambiente
Copie o arquivo `.env.example` para `.env` e configure:
```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```
MONGODB_URI=mongodb://localhost:27017/terramail
VITE_API_URL=http://localhost:3001
```

### 4. Executar o projeto

#### Desenvolvimento completo (frontend + backend):
```bash
npm run dev:full
```

#### Apenas frontend:
```bash
npm run dev
```

#### Apenas backend:
```bash
npm run dev:server
```

## Estrutura do Projeto

```
src/
├── components/
│   ├── Dashboard.tsx          # Dashboard principal
│   ├── Login.tsx             # Tela de login
│   └── CreateUserModal.tsx   # Modal de criação de usuários
├── contexts/
│   └── AuthContext.tsx       # Contexto de autenticação
├── hooks/
│   ├── useIPAddress.ts       # Hook para detectar IP
│   └── useUsers.ts           # Hook para gerenciar usuários
├── lib/
│   ├── storage.ts            # Armazenamento local (fallback)
│   ├── mongodb.ts            # Configuração e modelos MongoDB
│   └── supabase.ts           # Configuração Supabase
server/
└── index.js                  # Servidor Express com MongoDB
```

## Funcionalidades do Admin

### Gerenciamento de Usuários
- ✅ Visualizar todos os usuários
- ✅ Criar novos usuários
- ✅ Banir/desbanir usuários
- ✅ Estender assinaturas
- ✅ Excluir usuários
- ✅ Configurar IPs permitidos

### Segurança
- 🛡️ Monitoramento de tentativas de login
- 🚫 Sistema de banimento automático por IP
- 📊 Logs detalhados de acesso

## Credenciais Padrão

- **Email:** admin@terramail.com
- **Senha:** admin123

## Tecnologias Utilizadas

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express
- **Banco de Dados:** MongoDB + Mongoose
- **Autenticação:** bcryptjs
- **Build:** Vite