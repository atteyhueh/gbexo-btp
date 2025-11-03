import { Router, Response } from 'express';
import pool from '../config/database.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [services]: any = await connection.execute(
      'SELECT * FROM services WHERE is_active = true ORDER BY order_index ASC'
    );
    connection.release();
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, icon, order_index, is_active } = req.body;
    const connection = await pool.getConnection();

    const [result]: any = await connection.execute(
      'INSERT INTO services (title, description, icon, order_index, is_active) VALUES (?, ?, ?, ?, ?)',
      [title, description, icon, order_index, is_active || true]
    );

    connection.release();
    res.json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, icon, order_index, is_active } = req.body;
    const connection = await pool.getConnection();

    await connection.execute(
      'UPDATE services SET title = ?, description = ?, icon = ?, order_index = ?, is_active = ? WHERE id = ?',
      [title, description, icon, order_index, is_active, id]
    );

    connection.release();
    res.json({ id, ...req.body });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();

    await connection.execute('DELETE FROM services WHERE id = ?', [id]);

    connection.release();
    res.json({ message: 'Service deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

export default router;
