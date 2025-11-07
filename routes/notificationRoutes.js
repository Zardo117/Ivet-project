// routes/notificationRoutes.js

const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/notifications/send:
 *   post:
 *     summary: Enviar notificação SMS para o tutor
 *     tags: [Notificações]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Este endpoint envia uma mensagem SMS para o telefone do tutor
 *       utilizando o serviço Twilio. Requer configuração das variáveis
 *       de ambiente TWILIO_SID, TWILIO_TOKEN e TWILIO_PHONE.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *               - tutorPhone
 *             properties:
 *               message:
 *                 type: string
 *                 description: Conteúdo da mensagem a ser enviada
 *                 example: "Seu agendamento foi confirmado para 25/12/2024 às 10:00"
 *               tutorPhone:
 *                 type: string
 *                 description: Número de telefone do tutor no formato E.164
 *                 example: "+5511999999999"
 *     responses:
 *       200:
 *         description: Mensagem enviada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Mensagem enviada
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro ao enviar mensagem (verificar configuração do Twilio)
 */
router.post('/send', authMiddleware, notificationController.sendNotification);

module.exports = router;

