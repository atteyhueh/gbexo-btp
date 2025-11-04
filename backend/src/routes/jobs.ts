import { Router, Response } from 'express';
import pool from '../config/database.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();

// Route publique : retourne uniquement les jobs ouverts
router.get('/public', async (req: AuthRequest, res: Response) => {
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

// Route admin : retourne TOUS les jobs (ouverts et fermés)
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [jobs]: any = await connection.execute(
      'SELECT * FROM job_openings ORDER BY created_at DESC'
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
  let connection;
  try {
    const {
      title,
      department,
      contract_type,
      description,
      location,
      salary_range,
      is_open,
      requirements,
      responsibilities
    } = req.body;
    console.log('Creating job:', { title, department, location });

    connection = await pool.getConnection();

    const [result]: any = await connection.execute(
      `INSERT INTO job_openings (
        title,
        department,
        contract_type,
        description,
        location,
        salary_range,
        is_open,
        requirements,
        responsibilities
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        department,
        contract_type,
        description,
        location,
        salary_range || null,
        is_open !== undefined ? is_open : true,
        JSON.stringify(requirements || []),
        JSON.stringify(responsibilities || [])
      ]
    );

    res.json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Failed to create job', details: error instanceof Error ? error.message : String(error) });
  } finally {
    if (connection) connection.release();
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const { id } = req.params;
    const {
      title,
      department,
      contract_type,
      description,
      location,
      salary_range,
      is_open,
      requirements,
      responsibilities
    } = req.body;
    console.log('Updating job:', id, { title, department });

    connection = await pool.getConnection();

    await connection.execute(
      `UPDATE job_openings SET
        title = ?,
        department = ?,
        contract_type = ?,
        description = ?,
        location = ?,
        salary_range = ?,
        is_open = ?,
        requirements = ?,
        responsibilities = ?
      WHERE id = ?`,
      [
        title,
        department,
        contract_type,
        description,
        location,
        salary_range || null,
        is_open,
        JSON.stringify(requirements || []),
        JSON.stringify(responsibilities || []),
        id
      ]
    );

    res.json({ id, ...req.body });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ error: 'Failed to update job', details: error instanceof Error ? error.message : String(error) });
  } finally {
    if (connection) connection.release();
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const { id } = req.params;
    console.log('Deleting job:', id);

    connection = await pool.getConnection();

    await connection.execute('DELETE FROM job_openings WHERE id = ?', [id]);

    res.json({ message: 'Job deleted' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ error: 'Failed to delete job', details: error instanceof Error ? error.message : String(error) });
  } finally {
    if (connection) connection.release();
  }
});

export default router;