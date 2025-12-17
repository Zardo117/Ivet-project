// controllers/petController.js

const Pet = require('../models/Pet');
const User = require('../models/User');

exports.createPet = async (req, res) => {
  try {
    const { name, species, breed, age, weight, ownerId } = req.body;

    // Se o usuário logado for um tutor, ele só pode criar pets para si mesmo
    // Se for vet/admin, pode criar para qualquer ownerId especificado
    const finalOwnerId = req.user.role === 'tutor' ? req.user.id : (ownerId || req.user.id);

    if (!name || !species) {
      return res.status(400).json({ error: 'Nome e espécie são obrigatórios' });
    }

    const pet = await Pet.create({ 
      name, 
      species, 
      breed, 
      age, 
      weight: weight || null,
      ownerId: finalOwnerId 
    });
    
    res.status(201).json(pet);
  } catch (error) {
    console.error('Erro ao criar pet:', error);
    res.status(500).json({ error: 'Erro ao criar pet' });
  }
};

exports.getPets = async (req, res) => {
  try {
    const whereClause = {};
    
    // Se for tutor, só vê seus próprios pets
    if (req.user.role === 'tutor') {
      whereClause.ownerId = req.user.id;
    }

    const pets = await Pet.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'email', 'phone']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(pets);
  } catch (error) {
    console.error('Erro ao listar pets:', error);
    res.status(500).json({ error: 'Erro ao listar pets' });
  }
};

exports.getPetById = async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'email', 'phone']
      }]
    });

    if (!pet) {
      return res.status(404).json({ error: 'Pet não encontrado' });
    }

    // Verificação de permissão: Tutor só acessa seu próprio pet
    if (req.user.role === 'tutor' && pet.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    res.json(pet);
  } catch (error) {
    console.error('Erro ao buscar pet:', error);
    res.status(500).json({ error: 'Erro ao buscar pet' });
  }
};

exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id);

    if (!pet) {
      return res.status(404).json({ error: 'Pet não encontrado' });
    }

    // Apenas dono ou admin/vet pode deletar
    if (req.user.role === 'tutor' && pet.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await pet.destroy();
    res.json({ message: 'Pet removido com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar pet:', error);
    res.status(500).json({ error: 'Erro ao deletar pet' });
  }
};
