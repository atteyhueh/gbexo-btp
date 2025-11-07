import { Router, Response, Request } from 'express';
import pool from '../config/database.js';
import { EmailService } from '../services/emailService.js';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    // Validation des champs obligatoires
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'email', 'message']
      });
    }

    // Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format'
      });
    }

    console.log('New contact message from:', { name, email, subject });

    // Sauvegarde dans la base de données
    const connection = await pool.getConnection();
    
    try {
      const [result]: any = await connection.execute(
        'INSERT INTO quotes (name, email, company, project_type, description) VALUES (?, ?, ?, ?, ?)',
        [
          name, 
          email, 
          phone || '', 
          subject || 'Contact Form', 
          message
        ]
      );

      // Envoi des emails en arrière-plan (non bloquant)
      EmailService.sendContactEmails({
        name,
        email,
        phone: phone || undefined,
        subject: subject || 'Contact Form',
        message,
      }).catch(err => {
        console.error('Erreur email contact (non bloquante):', err);
      });

      res.json({ 
        id: result.insertId,
        message: 'Message sent successfully',
        email_sent: true
      });
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error processing contact:', error);
    res.status(500).json({ 
      error: 'Failed to send message', 
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;