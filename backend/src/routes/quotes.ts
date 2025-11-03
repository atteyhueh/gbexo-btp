import { Router, Response } from 'express';
import pool from '../config/database.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [quotes]: any = await connection.execute(
      'SELECT * FROM quotes ORDER BY created_at DESC'
    );
    connection.release();
    res.json(quotes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, company, project_type, description } = req.body;
    const connection = await pool.getConnection();

    const [result]: any = await connection.execute(
      'INSERT INTO quotes (name, email, company, project_type, description) VALUES (?, ?, ?, ?, ?)',
      [name, email, company || '', project_type || '', description]
    );

    connection.release();
    res.json({ id: result.insertId, message: 'Quote request submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit quote request' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();

    await connection.execute('DELETE FROM quotes WHERE id = ?', [id]);

    connection.release();
    res.json({ message: 'Quote deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete quote' });
  }
});

export default router;
