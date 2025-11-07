// routes/petRoutes.js

const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/pets:
 *   post:
 *     summary: Cadastrar um novo pet no sistema
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - species
 *               - ownerId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do pet
 *                 example: Rex
 *               species:
 *                 type: string
 *                 description: Espécie do animal (cão, gato, etc.)
 *                 example: cão
 *               breed:
 *                 type: string
 *                 description: Raça do animal
 *                 example: Labrador
 *               age:
 *                 type: integer
 *                 description: Idade do animal em anos
 *                 example: 3
 *               ownerId:
 *                 type: integer
 *                 description: ID do tutor (usuário) responsável pelo pet
 *                 example: 1
 *     responses:
 *       200:
 *         description: Pet cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 species:
 *                   type: string
 *                 breed:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 ownerId:
 *                   type: integer
 *       401:
 *         description: Não autenticado
 */
router.post('/', authMiddleware, petController.createPet);

/**
 * @swagger
 * /api/pets:
 *   get:
 *     summary: Listar todos os pets cadastrados
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pets retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   species:
 *                     type: string
 *                   breed:
 *                     type: string
 *                   age:
 *                     type: integer
 *                   ownerId:
 *                     type: integer
 *       401:
 *         description: Não autenticado
 */
router.get('/', authMiddleware, petController.getPets);

module.exports = router;

