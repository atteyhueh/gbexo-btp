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
  let connection;
  try {
    const { title, description, icon, image_url, order_index, is_active } = req.body;
    console.log('Creating service:', { title, icon, image_url });

    connection = await pool.getConnection();

    const [result]: any = await connection.execute(
      'INSERT INTO services (title, description, icon_name, image_url, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, icon, image_url || null, order_index || 0, is_active !== false]
    );

    res.json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Failed to create service', details: error instanceof Error ? error.message : String(error) });
  } finally {
    if (connection) connection.release();
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const { id } = req.params;
    const { title, description, icon, image_url, order_index, is_active } = req.body;
    console.log('Updating service:', id, { title, icon });

    connection = await pool.getConnection();

    await connection.execute(
      'UPDATE services SET title = ?, description = ?, icon_name = ?, image_url = ?, order_index = ?, is_active = ? WHERE id = ?',
      [title, description, icon, image_url || null, order_index, is_active, id]
    );

    res.json({ id, ...req.body });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Failed to update service', details: error instanceof Error ? error.message : String(error) });
  } finally {
    if (connection) connection.release();
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const { id } = req.params;
    console.log('Deleting service:', id);

    connection = await pool.getConnection();

    await connection.execute('DELETE FROM services WHERE id = ?', [id]);

    res.json({ message: 'Service deleted' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Failed to delete service', details: error instanceof Error ? error.message : String(error) });
  } finally {
    if (connection) connection.release();
  }
});

export default router;
