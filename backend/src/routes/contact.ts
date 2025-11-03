import { Router, Response } from 'express';
import pool from '../config/database.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone, message } = req.body;
    const connection = await pool.getConnection();

    const [result]: any = await connection.execute(
      'INSERT INTO quotes (name, email, company, project_type, description) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone || '', 'Contact Form', message]
    );

    connection.release();
    res.json({ id: result.insertId, message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
