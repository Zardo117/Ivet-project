// routes/diagnosisRoutes.js

const express = require('express');
const router = express.Router();
const diagnosisController = require('../controllers/diagnosisController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/diagnosis:
 *   post:
 *     summary: Obter diagnóstico baseado em sintomas do pet
 *     tags: [Diagnósticos]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Este endpoint utiliza um serviço de IA para gerar um diagnóstico
 *       preliminar baseado nos sintomas fornecidos e informações do pet
 *       (espécie e raça).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - symptoms
 *             properties:
 *               symptoms:
 *                 type: string
 *                 description: Sintomas apresentados pelo pet
 *                 example: "Vômito, falta de apetite, letargia"
 *               species:
 *                 type: string
 *                 description: Espécie do animal (opcional, mas recomendado)
 *                 example: cão
 *               breed:
 *                 type: string
 *                 description: Raça do animal (opcional, mas recomendado)
 *                 example: Labrador
 *     responses:
 *       200:
 *         description: Diagnóstico gerado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 possibleDiagnosis:
 *                   type: array
 *                   description: Lista de possíveis diagnósticos
 *                   items:
 *                     type: string
 *                   example: ["Gastrite", "Intoxicação alimentar"]
 *                 recommendations:
 *                   type: string
 *                   description: Recomendações baseadas no diagnóstico
 *                   example: "Manter o pet em jejum por 12 horas e observar..."
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro ao comunicar com o serviço de IA
 */
router.post('/', authMiddleware, diagnosisController.getDiagnosis);

module.exports = router;

