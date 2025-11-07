// routes/appointmentRoutes.js

const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Criar um novo agendamento
 *     tags: [Agendamentos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - vetId
 *               - petId
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Data e hora do agendamento
 *                 example: "2024-12-25T10:00:00Z"
 *               vetId:
 *                 type: integer
 *                 description: ID do veterinário responsável
 *                 example: 2
 *               petId:
 *                 type: integer
 *                 description: ID do pet que será atendido
 *                 example: 1
 *               status:
 *                 type: string
 *                 enum: [scheduled, completed, canceled]
 *                 description: Status do agendamento
 *                 default: scheduled
 *                 example: scheduled
 *     responses:
 *       200:
 *         description: Agendamento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 vetId:
 *                   type: integer
 *                 petId:
 *                   type: integer
 *                 status:
 *                   type: string
 *       401:
 *         description: Não autenticado
 */
router.post('/', authMiddleware, appointmentController.createAppointment);

/**
 * @swagger
 * /api/appointments/with-diagnosis:
 *   post:
 *     summary: Criar um agendamento com diagnóstico automático baseado em sintomas
 *     tags: [Agendamentos]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Este endpoint cria um agendamento e, se sintomas forem fornecidos,
 *       utiliza um serviço de IA para gerar um diagnóstico preliminar baseado
 *       nos sintomas e informações do pet.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - petId
 *               - vetId
 *               - date
 *             properties:
 *               petId:
 *                 type: integer
 *                 description: ID do pet que será atendido
 *                 example: 1
 *               vetId:
 *                 type: integer
 *                 description: ID do veterinário responsável
 *                 example: 2
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Data e hora do agendamento
 *                 example: "2024-12-25T10:00:00Z"
 *               symptoms:
 *                 type: string
 *                 description: Sintomas apresentados pelo pet (opcional, mas necessário para diagnóstico)
 *                 example: "Vômito, falta de apetite, letargia"
 *     responses:
 *       200:
 *         description: Agendamento criado com sucesso (com ou sem diagnóstico)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 appointment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     date:
 *                       type: string
 *                       format: date-time
 *                     vetId:
 *                       type: integer
 *                     petId:
 *                       type: integer
 *                     status:
 *                       type: string
 *                 diagnosis:
 *                   type: object
 *                   nullable: true
 *                   description: Diagnóstico gerado pela IA (null se não houver sintomas)
 *                   properties:
 *                     id:
 *                       type: integer
 *                     appointmentId:
 *                       type: integer
 *                     possibleDiagnosis:
 *                       type: array
 *                       items:
 *                         type: string
 *                     recommendations:
 *                       type: string
 *                     symptoms:
 *                       type: string
 *       401:
 *         description: Não autenticado
 */
router.post('/with-diagnosis', authMiddleware, appointmentController.createAppointmentWithDiagnosis);

module.exports = router;

