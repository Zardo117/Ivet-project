// config/db.js
// Configuração do banco de dados com suporte para mock e conexão real

const { Sequelize } = require('sequelize');

// Mock de banco de dados (in-memory)
class MockDatabase {
  constructor() {
    this.data = {
      users: [],
      pets: [],
      appointments: [],
      diagnoses: []
    };
    this.counters = {
      users: 0,
      pets: 0,
      appointments: 0,
      diagnoses: 0
    };
  }

  // Métodos para User
  async createUser(data) {
    const id = ++this.counters.users;
    const user = { id, ...data, createdAt: new Date(), updatedAt: new Date() };
    this.data.users.push(user);
    return user;
  }

  async findUserByEmail(email) {
    return this.data.users.find(u => u.email === email) || null;
  }

  async findUserById(id) {
    return this.data.users.find(u => u.id === id) || null;
  }

  // Métodos para Pet
  async createPet(data) {
    const id = ++this.counters.pets;
    const pet = { id, ...data, createdAt: new Date(), updatedAt: new Date() };
    this.data.pets.push(pet);
    return pet;
  }

  async findAllPets() {
    return [...this.data.pets];
  }

  async findPetById(id) {
    return this.data.pets.find(p => p.id === id) || null;
  }

  // Métodos para Appointment
  async createAppointment(data) {
    const id = ++this.counters.appointments;
    const appointment = { id, ...data, createdAt: new Date(), updatedAt: new Date() };
    this.data.appointments.push(appointment);
    return appointment;
  }

  async findAppointmentById(id) {
    return this.data.appointments.find(a => a.id === id) || null;
  }

  async findAllAppointments() {
    return [...this.data.appointments];
  }

  // Métodos para Diagnosis
  async createDiagnosis(data) {
    const id = ++this.counters.diagnoses;
    const diagnosis = { id, ...data, createdAt: new Date(), updatedAt: new Date() };
    this.data.diagnoses.push(diagnosis);
    return diagnosis;
  }

  async findDiagnosisById(id) {
    return this.data.diagnoses.find(d => d.id === id) || null;
  }
}

// Instância do mock
const mockDb = new MockDatabase();

// Configuração para usar mock ou banco real
const USE_MOCK_DB = process.env.USE_MOCK_DB !== 'false'; // Por padrão usa mock

let sequelize;

if (USE_MOCK_DB) {
  // Usando mock de banco de dados
  console.log('📦 Usando banco de dados MOCK (in-memory)');
  sequelize = {
    define: (modelName, attributes) => {
      // Retorna um objeto que simula um modelo Sequelize
      const model = {
        name: modelName,
        create: async (data) => {
          if (modelName === 'User') return await mockDb.createUser(data);
          if (modelName === 'Pet') return await mockDb.createPet(data);
          if (modelName === 'Appointment') return await mockDb.createAppointment(data);
          if (modelName === 'Diagnosis') return await mockDb.createDiagnosis(data);
          throw new Error(`Modelo ${modelName} não suportado`);
        },
        findAll: async () => {
          if (modelName === 'Pet') return await mockDb.findAllPets();
          if (modelName === 'Appointment') return await mockDb.findAllAppointments();
          if (modelName === 'User') return [...mockDb.data.users];
          if (modelName === 'Diagnosis') return [...mockDb.data.diagnoses];
          return [];
        },
        findByPk: async (id) => {
          if (modelName === 'User') return await mockDb.findUserById(id);
          if (modelName === 'Pet') return await mockDb.findPetById(id);
          if (modelName === 'Appointment') return await mockDb.findAppointmentById(id);
          if (modelName === 'Diagnosis') return await mockDb.findDiagnosisById(id);
          return null;
        },
        findOne: async (options) => {
          if (modelName === 'User' && options?.where?.email) {
            return await mockDb.findUserByEmail(options.where.email);
          }
          if (modelName === 'User' && options?.where?.id) {
            return await mockDb.findUserById(options.where.id);
          }
          if (modelName === 'Pet' && options?.where?.id) {
            return await mockDb.findPetById(options.where.id);
          }
          if (modelName === 'Appointment' && options?.where?.id) {
            return await mockDb.findAppointmentById(options.where.id);
          }
          if (modelName === 'Diagnosis' && options?.where?.id) {
            return await mockDb.findDiagnosisById(options.where.id);
          }
          return null;
        }
      };
      return model;
    },
    sync: async () => {
      console.log('✅ Mock database sincronizado');
      return Promise.resolve();
    },
    authenticate: async () => {
      console.log('✅ Mock database autenticado');
      return Promise.resolve();
    }
  };
} else {
  // Usando banco de dados real (PostgreSQL, MySQL, etc.)
  console.log('🗄️  Usando banco de dados REAL');
  const dialect = process.env.DB_DIALECT || 'postgres';
  
  sequelize = new Sequelize(
    process.env.DB_NAME || 'softpet',
    process.env.DB_USER || 'softpet_user',
    process.env.DB_PASSWORD || 'softpet_password',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: dialect,
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      // Para PostgreSQL
      ...(dialect === 'postgres' && {
        dialectOptions: {
          ssl: process.env.DB_SSL === 'true' ? {
            require: true,
            rejectUnauthorized: false
          } : false
        }
      })
    }
  );

  // Testa a conexão
  sequelize.authenticate()
    .then(() => {
      console.log('✅ Conexão com banco de dados estabelecida com sucesso');
    })
    .catch(err => {
      console.error('❌ Erro ao conectar com banco de dados:', err);
    });
}

module.exports = sequelize;
module.exports.mockDb = mockDb; // Exporta o mock para uso direto se necessário

