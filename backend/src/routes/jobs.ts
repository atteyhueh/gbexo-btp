import { Router, Response } from 'express';
import pool from '../config/database.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [jobs]: any = await connection.execute(
      'SELECT * FROM job_openings WHERE is_open = true ORDER BY created_at DESC'
    );
    connection.release();
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();

    const [job]: any = await connection.execute(
      'SELECT * FROM job_openings WHERE id = ?',
      [id]
    );

    connection.release();

    if (job.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, requirements, is_open } = req.body;
    const connection = await pool.getConnection();

    const [result]: any = await connection.execute(
      'INSERT INTO job_openings (title, description, requirements, is_open) VALUES (?, ?, ?, ?)',
      [title, description, JSON.stringify(requirements || []), is_open || true]
    );

    connection.release();
    res.json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, requirements, is_open } = req.body;
    const connection = await pool.getConnection();

    await connection.execute(
      'UPDATE job_openings SET title = ?, description = ?, requirements = ?, is_open = ? WHERE id = ?',
      [title, description, JSON.stringify(requirements || []), is_open, id]
    );

    connection.release();
    res.json({ id, ...req.body });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();

    await connection.execute('DELETE FROM job_openings WHERE id = ?', [id]);

    connection.release();
    res.json({ message: 'Job deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

export default router;
