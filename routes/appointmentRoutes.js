const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas as rotas requerem autenticação
router.use(authMiddleware);

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Lista todos os agendamentos
 *     tags: [Agendamentos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 */
router.get('/', appointmentController.getAllAppointments);

/**
 * @swagger
 * /api/appointments/{id}:
 *   get:
 *     summary: Busca um agendamento pelo ID
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalhes do agendamento
 */
router.get('/:id', appointmentController.getAppointmentById);

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
 *               - petId
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Data e hora do agendamento
 *               petId:
 *                 type: integer
 *                 description: ID do pet
 *               vetId:
 *                 type: integer
 *                 description: ID do veterinário (opcional, usa o usuário logado se não fornecido)
 *               status:
 *                 type: string
 *                 enum: [Agendado, Concluido, Cancelado]
 *               type:
 *                 type: string
 *                 enum: [Consulta, Vacina, Retorno, Cirurgia]
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
 */
router.post('/', appointmentController.createAppointment);

/**
 * @swagger
 * /api/appointments/{id}:
 *   put:
 *     summary: Atualiza um agendamento
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Agendamento atualizado
 */
router.put('/:id', appointmentController.updateAppointment);

/**
 * @swagger
 * /api/appointments/{id}:
 *   delete:
 *     summary: Remove um agendamento
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Agendamento removido
 */
router.delete('/:id', appointmentController.deleteAppointment);

/**
 * @swagger
 * /api/appointments/with-diagnosis:
 *   post:
 *     summary: Criar um agendamento com diagnóstico automático baseado em sintomas
 *     tags: [Agendamentos]
 *     security:
 *       - bearerAuth: []
 */
router.post('/with-diagnosis', appointmentController.createAppointmentWithDiagnosis);

module.exports = router;
