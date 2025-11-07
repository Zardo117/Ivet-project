// controllers/notificationController.js

const twilio = require('twilio');

// Inicializa cliente Twilio apenas se as credenciais estiverem configuradas
let client = null;
if (process.env.TWILIO_SID && process.env.TWILIO_TOKEN) {
  try {
    client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
  } catch (error) {
    console.warn('⚠️  Twilio não configurado. Usando modo mock para notificações.');
  }
}

exports.sendNotification = async (req, res) => {
  try {
    const { message, tutorPhone } = req.body;

    if (!message || !tutorPhone) {
      return res.status(400).json({ error: 'Mensagem e telefone do tutor são obrigatórios' });
    }

    // Se Twilio estiver configurado, envia mensagem real
    if (client && process.env.TWILIO_PHONE) {
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE,
        to: tutorPhone
      });
      res.json({ status: 'Mensagem enviada', sent: true });
    } else {
      // Modo mock para MVP
      console.log('📱 [MOCK] Notificação SMS:', {
        to: tutorPhone,
        message: message
      });
      res.json({ 
        status: 'Mensagem enviada (modo mock)', 
        sent: false,
        note: 'Twilio não configurado. Configure TWILIO_SID, TWILIO_TOKEN e TWILIO_PHONE para envio real.'
      });
    }
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    res.status(500).json({ error: 'Erro ao enviar notificação' });
  }
};

