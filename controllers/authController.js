// controllers/authController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Nome, email, senha e papel são obrigatórios' });
    }

    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      role,
      phone: phone || null
    });

    // Remove a senha da resposta
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json({ message: 'Usuário registrado com sucesso', user: userResponse });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
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



