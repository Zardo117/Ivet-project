// routes/aiRoutes.js

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas as rotas requerem autenticação
router.use(authMiddleware);

/**
 * @swagger
 * /api/ai/analyze:
 *   post:
 *     summary: Analisa um caso clínico usando IA
 *     tags: [IA]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - symptoms
 *             properties:
 *               species:
 *                 type: string
 *                 description: Espécie do animal
 *               breed:
 *                 type: string
 *                 description: Raça do animal
 *               age:
 *                 type: number
 *                 description: Idade do animal
 *               symptoms:
 *                 type: string
 *                 description: Sintomas observados
 *               history:
 *                 type: string
 *                 description: Histórico médico relevante
 *     responses:
 *       200:
 *         description: Análise gerada com sucesso
 */
router.post('/analyze', aiController.analyzeClinicalCase);

/**
 * @swagger
 * /api/ai/chat:
 *   post:
 *     summary: Chat com assistente veterinário IA
 *     tags: [IA]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: Mensagem/pergunta do usuário
 *               conversationHistory:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Histórico da conversa
 *     responses:
 *       200:
 *         description: Resposta do assistente
 */
router.post('/chat', aiController.chat);

module.exports = router;

