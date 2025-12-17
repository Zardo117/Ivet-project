const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas as rotas de pets requerem autenticação
router.use(authMiddleware);

/**
 * @swagger
 * /api/pets:
 *   get:
 *     summary: Lista todos os pets (ou apenas os do tutor logado)
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pets
 */
router.get('/', petController.getPets);

/**
 * @swagger
 * /api/pets/{id}:
 *   get:
 *     summary: Busca um pet pelo ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalhes do pet
 */
router.get('/:id', petController.getPetById);

/**
 * @swagger
 * /api/pets:
 *   post:
 *     summary: Cadastra um novo pet
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - species
 *             properties:
 *               name:
 *                 type: string
 *               species:
 *                 type: string
 *               breed:
 *                 type: string
 *               age:
 *                 type: integer
 *               weight:
 *                 type: number
 *     responses:
 *       201:
 *         description: Pet criado com sucesso
 */
router.post('/', petController.createPet);

/**
 * @swagger
 * /api/pets/{id}:
 *   delete:
 *     summary: Remove um pet
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pet removido
 */
router.delete('/:id', petController.deletePet);

module.exports = router;
