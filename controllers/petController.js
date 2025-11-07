// controllers/petController.js

const Pet = require('../models/Pet');

exports.createPet = async (req, res) => {
  try {
    const { name, species, breed, age, ownerId } = req.body;

    if (!name || !species || !ownerId) {
      return res.status(400).json({ error: 'Nome, espécie e ID do tutor são obrigatórios' });
    }

    const pet = await Pet.create({ name, species, breed, age, ownerId });
    res.json(pet);
  } catch (error) {
    console.error('Erro ao criar pet:', error);
    res.status(500).json({ error: 'Erro ao criar pet' });
  }
};

exports.getPets = async (req, res) => {
  try {
    const pets = await Pet.findAll();
    res.json(pets);
  } catch (error) {
    console.error('Erro ao listar pets:', error);
    res.status(500).json({ error: 'Erro ao listar pets' });
  }
};



