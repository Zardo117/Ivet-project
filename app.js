// app.js
// Arquivo principal da aplicação SoftPet API

const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();

// Middlewares
// Configurar CORS para aceitar requisições do frontend
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requisições sem origin (ex: mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    
    // Lista de origens permitidas
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:8080',
      'http://localhost:8081',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'https://vet-harmony-hub.vercel.app',
      'https://vetcare-pro.vercel.app',
    ];
    
    // Verificar se é uma URL do Vercel (qualquer subdomínio .vercel.app)
    const isVercel = /\.vercel\.app$/.test(origin) || origin.includes('vercel.app');
    
    // Verificar se é uma URL localhost
    const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');
    
    // Permitir se estiver na lista ou for Vercel/localhost
    if (allowedOrigins.includes(origin) || isVercel || isLocalhost) {
      callback(null, true);
    } else {
      // Em desenvolvimento, permitir todas as origens
      if (process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        // Em produção, permitir mesmo assim (por enquanto) mas logar
        console.log(`CORS: Origin permitida - ${origin}`);
        callback(null, true);
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SoftPet API',
      version: '1.0.0',
      description: `
        API RESTful para gerenciamento de clínica veterinária.
        
        ## Funcionalidades
        
        - **Autenticação**: Registro e login de usuários (veterinários, tutores, administradores)
        - **Pets**: Cadastro e listagem de pets
        - **Agendamentos**: Criação de agendamentos com ou sem diagnóstico automático
        - **Diagnósticos**: Geração de diagnósticos preliminares baseados em sintomas usando IA
        - **Notificações**: Envio de SMS para tutores via Twilio
        
        ## Autenticação
        
        A maioria dos endpoints requer autenticação via JWT. Após fazer login, 
        você receberá um token que deve ser enviado no header:
        
        \`\`\`
        Authorization: Bearer <seu_token>
        \`\`\`
        
        ## Banco de Dados
        
        Atualmente a API está configurada para usar um banco de dados mock (in-memory).
        Para usar um banco de dados real, configure as variáveis de ambiente e defina:
        
        \`\`\`
        USE_MOCK_DB=false
        \`\`\`
      `,
      contact: {
        name: 'Suporte SoftPet',
        email: 'suporte@softpet.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desenvolvimento'
      },
      {
        url: 'https://api.softpet.com',
        description: 'Servidor de produção'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtido através do endpoint /api/auth/login'
        }
      }
    },
    tags: [
      {
        name: 'Autenticação',
        description: 'Endpoints para registro e login de usuários'
      },
      {
        name: 'Pets',
        description: 'Endpoints para gerenciamento de pets'
      },
      {
        name: 'Agendamentos',
        description: 'Endpoints para criação e gerenciamento de agendamentos'
      },
      {
        name: 'Diagnósticos',
        description: 'Endpoints para geração de diagnósticos baseados em sintomas'
      },
      {
        name: 'Notificações',
        description: 'Endpoints para envio de notificações SMS'
      }
    ]
  },
  apis: ['./routes/*.js'] // Caminho para os arquivos de rotas com anotações Swagger
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Rotas do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'SoftPet API Documentation'
}));

// Rotas da API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/pets', require('./routes/petRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/diagnosis', require('./routes/diagnosisRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à API SoftPet',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      auth: '/api/auth',
      pets: '/api/pets',
      appointments: '/api/appointments',
      diagnosis: '/api/diagnosis',
      notifications: '/api/notifications'
    }
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.path,
    method: req.method
  });
});

const PORT = process.env.PORT || 3000;

// Inicializar banco de dados (mock ou real)
const sequelize = require('./config/db');

// Carregar relacionamentos dos models
require('./models/index');

// Sincronizar modelos apenas se estiver usando mock (para desenvolvimento)
// Em produção com banco real, use migrations
if (process.env.USE_MOCK_DB !== 'false' && process.env.NODE_ENV !== 'production') {
  sequelize.sync().then(() => {
    console.log('✅ Banco de dados sincronizado');
  }).catch(err => {
    console.error('❌ Erro ao sincronizar banco de dados:', err);
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📚 Documentação Swagger disponível em http://localhost:${PORT}/api-docs`);
  console.log(`🌐 API disponível em http://localhost:${PORT}/api`);
});

module.exports = app;

