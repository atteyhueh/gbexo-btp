import { Router, Response } from 'express';
import pool from '../config/database.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [projects]: any = await connection.execute(
      'SELECT * FROM projects ORDER BY order_index ASC'
    );
    connection.release();
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();

    const [project]: any = await connection.execute(
      'SELECT * FROM projects WHERE id = ?',
      [id]
    );

    if (project.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Project not found' });
    }

    const [images]: any = await connection.execute(
      'SELECT * FROM project_images WHERE project_id = ? ORDER BY order_index ASC',
      [id]
    );

    connection.release();
    res.json({ ...project[0], images });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const { title, description, location, category, project_type, client_name, image_url, status, duration_months, budget, team_size, featured, order_index, technologies } = req.body;
    console.log('Creating project:', { title, category, location });

    connection = await pool.getConnection();

    const [result]: any = await connection.execute(
      'INSERT INTO projects (title, description, location, category, project_type, client_name, thumbnail_url, featured, order_index, technologies) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, location, category, project_type, client_name, image_url, featured || false, order_index || 0, JSON.stringify(technologies || [])]
    );

    res.json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project', details: error instanceof Error ? error.message : String(error) });
  } finally {
    if (connection) connection.release();
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const { id } = req.params;
    const { title, description, location, category, project_type, client_name, image_url, status, duration_months, budget, team_size, featured, order_index, technologies } = req.body;
    console.log('Updating project:', id, { title, category });

    connection = await pool.getConnection();

    await connection.execute(
      'UPDATE projects SET title = ?, description = ?, location = ?, category = ?, project_type = ?, client_name = ?, thumbnail_url = ?, featured = ?, order_index = ?, technologies = ? WHERE id = ?',
      [title, description, location, category, project_type, client_name, image_url, featured, order_index, JSON.stringify(technologies || []), id]
    );

    res.json({ id, ...req.body });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project', details: error instanceof Error ? error.message : String(error) });
  } finally {
    if (connection) connection.release();
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const { id } = req.params;
    console.log('Deleting project:', id);

    connection = await pool.getConnection();

    await connection.execute('DELETE FROM project_images WHERE project_id = ?', [id]);
    await connection.execute('DELETE FROM projects WHERE id = ?', [id]);

    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project', details: error instanceof Error ? error.message : String(error) });
  } finally {
    if (connection) connection.release();
  }
});

export default router;
