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
  let connection;
  try {
    const { client_name, client_role, client_company, message, rating, avatar_url, is_featured, order_index } = req.body;
    console.log('Creating testimonial:', { client_name, client_role, client_company });

    connection = await pool.getConnection();

    const [result]: any = await connection.execute(
      'INSERT INTO testimonials (client_name, client_role, client_company, message, rating, avatar_url, is_featured, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [client_name, client_role, client_company, message, rating || 5, avatar_url, is_featured || false, order_index || 0]
    );

    res.json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ error: 'Failed to create testimonial', details: error instanceof Error ? error.message : String(error) });
  } finally {
    if (connection) connection.release();
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const { id } = req.params;
    const { client_name, client_role, client_company, message, rating, avatar_url, is_featured, order_index } = req.body;
    console.log('Updating testimonial:', id);

    connection = await pool.getConnection();

    await connection.execute(
      'UPDATE testimonials SET client_name = ?, client_role = ?, client_company = ?, message = ?, rating = ?, avatar_url = ?, is_featured = ?, order_index = ? WHERE id = ?',
      [client_name, client_role, client_company, message, rating, avatar_url, is_featured, order_index, id]
    );

    res.json({ id, ...req.body });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ error: 'Failed to update testimonial', details: error instanceof Error ? error.message : String(error) });
  } finally {
    if (connection) connection.release();
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const { id } = req.params;
    console.log('Deleting testimonial:', id);

    connection = await pool.getConnection();

    await connection.execute('DELETE FROM testimonials WHERE id = ?', [id]);

    res.json({ message: 'Testimonial deleted' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ error: 'Failed to delete testimonial', details: error instanceof Error ? error.message : String(error) });
  } finally {
    if (connection) connection.release();
  }
});

export default router;
