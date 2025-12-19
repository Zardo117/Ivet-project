// controllers/authController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    console.log('Tentativa de registro:', { name, email, role, hasPassword: !!password });

    if (!name || !email || !password || !role) {
      console.log('Validação falhou:', { hasName: !!name, hasEmail: !!email, hasPassword: !!password, hasRole: !!role });
      return res.status(400).json({ error: 'Nome, email, senha e papel são obrigatórios' });
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log(`Tentativa de registro com email já cadastrado: ${email}`);
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Validação de senha
    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      role,
      phone: phone || null
    });

    // Remove a senha da resposta - tratar diferentes formatos de retorno do Sequelize
    let userResponse;
    if (typeof user.toJSON === 'function') {
      userResponse = user.toJSON();
    } else if (user.dataValues) {
      userResponse = { ...user.dataValues };
    } else {
      userResponse = { ...user };
    }
    
    delete userResponse.password;

    console.log(`Usuário registrado com sucesso: ${email}`);
    res.status(201).json({ 
      message: 'Usuário registrado com sucesso', 
      user: {
        id: String(userResponse.id),
        name: userResponse.name,
        email: userResponse.email,
        role: userResponse.role,
        phone: userResponse.phone || null
      }
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    console.error('Stack trace:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    // Tratar erros específicos do Sequelize
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map((err) => err.message).join(', ');
      return res.status(400).json({ error: `Dados inválidos: ${validationErrors}` });
    }

    // Retornar erro mais detalhado para debug
    const errorResponse = {
      error: 'Erro ao registrar usuário',
      message: error.message || 'Erro desconhecido',
      name: error.name || 'UnknownError'
    };

    // Se for erro de conexão com banco, dar mensagem mais clara
    if (error.name === 'SequelizeConnectionError' || error.message?.includes('connection')) {
      errorResponse.error = 'Erro de conexão com o banco de dados';
      console.error('Erro de conexão com banco detectado');
    }

    res.status(500).json(errorResponse);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log(`Login falhou: usuário não encontrado - ${email}`);
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log(`Login falhou: senha inválida para usuário - ${email}`);
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'JWT_SECRET não configurado' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' } // Aumentar expiração para 24h
    );

    const userResponse = {
      id: String(user.id), // Garantir que o ID seja string
      name: user.name,
      email: user.email,
      role: user.role
    };

    console.log(`Login bem-sucedido para: ${email}`);
    res.json({ token, user: userResponse });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao fazer login', details: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};



