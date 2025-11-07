# SoftPet API

API RESTful para gerenciamento de clínica veterinária com documentação Swagger completa.

## 🚀 Funcionalidades

- **Autenticação**: Registro e login de usuários (veterinários, tutores, administradores)
- **Pets**: Cadastro e listagem de pets
- **Agendamentos**: Criação de agendamentos com ou sem diagnóstico automático
- **Diagnósticos**: Geração de diagnósticos preliminares baseados em sintomas usando IA
- **Notificações**: Envio de SMS para tutores via Twilio

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## 🔧 Instalação

### Opção 1: Usando Docker (Recomendado) 🐳

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd "Projeto softpet"
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure:
```env
# JWT Secret (obrigatório)
JWT_SECRET=seu_jwt_secret_aqui

# Banco de dados
DB_NAME=softpet
DB_USER=softpet_user
DB_PASSWORD=softpet_password
DB_HOST=postgres
DB_PORT=5432
DB_DIALECT=postgres
USE_MOCK_DB=false

# Twilio (opcional, para notificações SMS)
# TWILIO_SID=your_twilio_sid
# TWILIO_TOKEN=your_twilio_token
# TWILIO_PHONE=your_twilio_phone_number
```

3. Inicie com Docker Compose:
```bash
# Modo produção
docker-compose up -d

# Modo desenvolvimento
docker-compose -f docker-compose.dev.yml up
```

A API estará disponível em `http://localhost:3000`

📚 **Veja o guia completo de Docker em [DOCKER.md](./DOCKER.md)**

### Opção 2: Instalação Local

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd "Projeto softpet"
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure:
```env
# JWT Secret (obrigatório)
JWT_SECRET=seu_jwt_secret_aqui

# Banco de dados (padrão: mock)
USE_MOCK_DB=true

# Para usar banco real, defina:
# USE_MOCK_DB=false
# DB_DIALECT=postgres
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=softpet
# DB_USER=root
# DB_PASSWORD=sua_senha

# Twilio (opcional, para notificações SMS)
# TWILIO_SID=your_twilio_sid
# TWILIO_TOKEN=your_twilio_token
# TWILIO_PHONE=your_twilio_phone_number
```

4. Execute as migrations (se usar banco real):
```bash
npm run migrate
npm run seed
```

## 🏃 Executando a aplicação

### Com Docker:
```bash
docker-compose up -d
```

### Localmente:

#### Modo desenvolvimento:
```bash
npm run dev
```

#### Modo produção:
```bash
npm start
```

A API estará disponível em `http://localhost:3000`

## 📚 Documentação Swagger

Após iniciar a aplicação, acesse a documentação Swagger em:

**http://localhost:3000/api-docs**

A documentação Swagger fornece:
- Descrição completa de todos os endpoints
- Exemplos de requisições e respostas
- Teste interativo dos endpoints
- Esquemas de dados detalhados

## 🔐 Autenticação

A maioria dos endpoints requer autenticação via JWT. Para obter um token:

1. Registre um usuário:
```bash
POST /api/auth/register
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "role": "tutor"
}
```

2. Faça login:
```bash
POST /api/auth/login
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

3. Use o token retornado no header:
```
Authorization: Bearer <seu_token>
```

## 📡 Endpoints Principais

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login

### Pets
- `POST /api/pets` - Cadastrar pet (requer autenticação)
- `GET /api/pets` - Listar pets (requer autenticação)

### Agendamentos
- `POST /api/appointments` - Criar agendamento (requer autenticação)
- `POST /api/appointments/with-diagnosis` - Criar agendamento com diagnóstico automático (requer autenticação)

### Diagnósticos
- `POST /api/diagnosis` - Obter diagnóstico baseado em sintomas (requer autenticação)

### Notificações
- `POST /api/notifications/send` - Enviar SMS para tutor (requer autenticação)

## 🗄️ Banco de Dados

### Modo Mock (Padrão - MVP)

Por padrão, a API usa um banco de dados mock (in-memory) que não persiste dados entre reinicializações. Ideal para desenvolvimento e testes.

### Modo Banco Real

Para usar um banco de dados real (PostgreSQL, MySQL, etc.):

1. Configure as variáveis de ambiente no `.env`:
```env
USE_MOCK_DB=false
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=softpet
DB_USER=root
DB_PASSWORD=sua_senha
```

2. A API automaticamente detectará a configuração e usará o banco real.

## 🤖 Serviço de IA (Mock)

O serviço de diagnóstico por IA está em modo mock para o MVP. Ele gera diagnósticos baseados em palavras-chave nos sintomas fornecidos.

Para usar um serviço real de IA, substitua o conteúdo de `services/aiService.js` por uma chamada real ao seu serviço.

## 📱 Notificações SMS

As notificações SMS funcionam em modo mock por padrão. Para envio real:

1. Configure uma conta Twilio
2. Adicione as credenciais no `.env`:
```env
TWILIO_SID=your_twilio_sid
TWILIO_TOKEN=your_twilio_token
TWILIO_PHONE=your_twilio_phone_number
```

## 🧪 Testando a API

### Usando Swagger UI

1. Acesse `http://localhost:3000/api-docs`
2. Clique em "Authorize" e insira seu token JWT
3. Teste os endpoints diretamente na interface

### Usando cURL

```bash
# Registrar usuário
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@example.com","password":"senha123","role":"tutor"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"senha123"}'

# Criar pet (substitua TOKEN pelo token retornado no login)
curl -X POST http://localhost:3000/api/pets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name":"Rex","species":"cão","breed":"Labrador","age":3,"ownerId":1}'
```

## 📝 Estrutura do Projeto

```
Projeto softpet/
├── config/
│   └── db.js              # Configuração do banco (mock/real)
├── controllers/
│   ├── authController.js
│   ├── petController.js
│   ├── appointmentController.js
│   ├── diagnosisController.js
│   └── notificationController.js
├── middlewares/
│   └── authMiddleware.js
├── models/
│   ├── User.js
│   ├── Pet.js
│   ├── Appointment.js
│   └── Diagnosis.js
├── routes/
│   ├── authRoutes.js
│   ├── petRoutes.js
│   ├── appointmentRoutes.js
│   ├── diagnosisRoutes.js
│   └── notificationRoutes.js
├── services/
│   └── aiService.js        # Serviço mock de IA
├── app.js                  # Arquivo principal
├── package.json
└── README.md
```

## 🔄 Migrando para Banco Real

Quando estiver pronto para usar um banco de dados real:

1. Configure as variáveis de ambiente
2. Instale o driver do banco escolhido:
   - PostgreSQL: `npm install pg pg-hstore`
   - MySQL: `npm install mysql2`
   - SQLite: `npm install sqlite3`
3. Defina `USE_MOCK_DB=false` no `.env`
4. A API automaticamente usará o banco real

## 📄 Licença

ISC

## 👥 Suporte

Para dúvidas ou problemas, consulte a documentação Swagger em `/api-docs` ou abra uma issue no repositório.

