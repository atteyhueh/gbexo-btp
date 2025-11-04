import { Router, Response } from 'express';
import pool from '../config/database.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [members]: any = await connection.execute(
      'SELECT * FROM team_members ORDER BY order_index ASC'
    );
    connection.release();
    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const { name, role, bio, image_url, order_index } = req.body;
    console.log('Creating team member:', { name, role, bio, image_url, order_index });

    connection = await pool.getConnection();

    const [result]: any = await connection.execute(
      'INSERT INTO team_members (name, role, bio, image_url, order_index) VALUES (?, ?, ?, ?, ?)',
      [name, role, bio, image_url, order_index || 0]
    );

    res.json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({ error: 'Failed to create team member', details: error instanceof Error ? error.message : String(error) });
  } finally {
    if (connection) connection.release();
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const { id } = req.params;
    const { name, role, bio, image_url, order_index } = req.body;
    console.log('Updating team member:', id, { name, role, bio, image_url, order_index });

    connection = await pool.getConnection();

    await connection.execute(
      'UPDATE team_members SET name = ?, role = ?, bio = ?, image_url = ?, order_index = ? WHERE id = ?',
      [name, role, bio, image_url, order_index, id]
    );

    res.json({ id, ...req.body });
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({ error: 'Failed to update team member', details: error instanceof Error ? error.message : String(error) });
  } finally {
    if (connection) connection.release();
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const { id } = req.params;
    console.log('Deleting team member:', id);

    connection = await pool.getConnection();

    await connection.execute('DELETE FROM team_members WHERE id = ?', [id]);

    res.json({ message: 'Team member deleted' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ error: 'Failed to delete team member', details: error instanceof Error ? error.message : String(error) });
  } finally {
    if (connection) connection.release();
  }
});

export default router;
