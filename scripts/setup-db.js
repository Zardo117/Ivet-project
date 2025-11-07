// scripts/setup-db.js
// Script para configurar o banco de dados (migrations + seeds)

require('dotenv').config();
const { execSync } = require('child_process');

console.log('🚀 Iniciando configuração do banco de dados...\n');

try {
  // Executa migrations
  console.log('📦 Executando migrations...');
  execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });
  console.log('✅ Migrations executadas com sucesso!\n');

  // Executa seeds
  console.log('🌱 Executando seeds...');
  execSync('npx sequelize-cli db:seed:all', { stdio: 'inherit' });
  console.log('✅ Seeds executados com sucesso!\n');

  console.log('🎉 Banco de dados configurado com sucesso!');
} catch (error) {
  console.error('❌ Erro ao configurar banco de dados:', error.message);
  process.exit(1);
}

