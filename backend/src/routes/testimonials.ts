import { Router, Response } from 'express';
import pool from '../config/database.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [testimonials]: any = await connection.execute(
      'SELECT * FROM testimonials ORDER BY order_index ASC'
    );
    connection.release();
    res.json(testimonials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { client_name, client_role, client_company, message, rating, avatar_url, is_featured, order_index } = req.body;
    const connection = await pool.getConnection();

    const [result]: any = await connection.execute(
      'INSERT INTO testimonials (client_name, client_role, client_company, message, rating, avatar_url, is_featured, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [client_name, client_role, client_company, message, rating || 5, avatar_url, is_featured || false, order_index || 0]
    );

    connection.release();
    res.json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { client_name, client_role, client_company, message, rating, avatar_url, is_featured, order_index } = req.body;
    const connection = await pool.getConnection();

    await connection.execute(
      'UPDATE testimonials SET client_name = ?, client_role = ?, client_company = ?, message = ?, rating = ?, avatar_url = ?, is_featured = ?, order_index = ? WHERE id = ?',
      [client_name, client_role, client_company, message, rating, avatar_url, is_featured, order_index, id]
    );

    connection.release();
    res.json({ id, ...req.body });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();

    await connection.execute('DELETE FROM testimonials WHERE id = ?', [id]);

    connection.release();
    res.json({ message: 'Testimonial deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

export default router;
