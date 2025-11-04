// routes/announcements.ts
import { Router, Response } from 'express';
import pool from '../config/database.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();

// GET annonces urgentes (DOIT être avant /announcements/:id)
router.get('/announcements/urgent', async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [announcements]: any = await connection.execute(
      'SELECT * FROM announcements WHERE is_urgent = true AND is_active = true ORDER BY created_at DESC'
    );
    res.json(announcements);
  } catch (error) {
    console.error('Error fetching urgent announcements:', error);
    res.status(500).json({
      error: 'Failed to fetch urgent announcements',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    if (connection) connection.release();
  }
});

// GET nombre d'annonces (DOIT être avant /announcements/:id)
router.get('/announcements/count', async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows]: any = await connection.execute(
      'SELECT COUNT(*) as count FROM announcements WHERE is_active = true'
    );
    res.json({ count: rows[0].count });
  } catch (error) {
    console.error('Error fetching announcements count:', error);
    res.status(500).json({
      error: 'Failed to fetch announcements count',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    if (connection) connection.release();
  }
});

// GET toutes les annonces actives
router.get('/announcements', async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [announcements]: any = await connection.execute(
      'SELECT * FROM announcements WHERE is_active = true ORDER BY created_at DESC'
    );
    res.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({
      error: 'Failed to fetch announcements',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    if (connection) connection.release();
  }
});

// GET une annonce par ID
router.get('/announcements/:id', async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await pool.getConnection();
    const [rows]: any = await connection.execute(
      'SELECT * FROM announcements WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Annonce non trouvée' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching announcement by ID:', error);
    res.status(500).json({
      error: 'Failed to fetch announcement',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    if (connection) connection.release();
  }
});

// POST créer une annonce (admin uniquement)
router.post('/announcements', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const { title, content, cover_image_url, is_urgent, is_active, link_url } = req.body;
    console.log('Creating announcement:', { title, is_urgent });

    connection = await pool.getConnection();
    const [result]: any = await connection.execute(
      'INSERT INTO announcements (title, content, cover_image_url, is_urgent, is_active, link_url) VALUES (?, ?, ?, ?, ?, ?)',
      [title, content, cover_image_url, is_urgent || false, is_active !== false, link_url || null]
    );

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({
      error: 'Failed to create announcement',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    if (connection) connection.release();
  }
});

// PUT mettre à jour une annonce (admin uniquement)
router.put('/announcements/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const { id } = req.params;
    const { title, content, cover_image_url, is_urgent, is_active, link_url } = req.body;
    console.log('Updating announcement:', id);

    connection = await pool.getConnection();
    await connection.execute(
      'UPDATE announcements SET title = ?, content = ?, cover_image_url = ?, is_urgent = ?, is_active = ?, link_url = ? WHERE id = ?',
      [title, content, cover_image_url, is_urgent, is_active, link_url || null, id]
    );

    res.json({ message: 'Announcement updated' });
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({
      error: 'Failed to update announcement',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    if (connection) connection.release();
  }
});

// DELETE supprimer une annonce (admin uniquement)
router.delete('/announcements/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const { id } = req.params;
    console.log('Deleting announcement:', id);

    connection = await pool.getConnection();
    await connection.execute('DELETE FROM announcements WHERE id = ?', [id]);

    res.json({ message: 'Announcement deleted' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({
      error: 'Failed to delete announcement',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    if (connection) connection.release();
  }
});

export default router;