// routes/announcements.ts
import { Router, Response } from 'express';
import pool from '../config/database.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();

// IMPORTANT: Les routes spécifiques doivent TOUJOURS être avant les routes avec paramètres dynamiques

// GET annonces urgentes (route spécifique)
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

// GET nombre d'annonces (route spécifique)
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

// GET médias pour une annonce - DOIT être avant /announcements/:id
router.get('/announcements/:id/media', async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const { id } = req.params;
    console.log('Fetching media for announcement:', id);
    
    connection = await pool.getConnection();
    const [media]: any = await connection.execute(
      'SELECT * FROM announcements_media WHERE announcement_id = ? ORDER BY order_index ASC',
      [id]
    );
    res.json(media);
  } catch (error) {
    console.error('Error fetching announcement media:', error);
    res.status(500).json({
      error: 'Failed to fetch announcement media',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    if (connection) connection.release();
  }
});

// POST ajouter un média à une annonce (ajout individuel)
router.post('/announcements/:id/media', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const { id } = req.params;
    const { media_url, media_type, is_featured, order_index } = req.body;
    console.log('Adding media to announcement:', id);

    connection = await pool.getConnection();
    const [result]: any = await connection.execute(
      'INSERT INTO announcements_media (announcement_id, media_url, media_type, is_featured, order_index) VALUES (?, ?, ?, ?, ?)',
      [id, media_url, media_type, is_featured || false, order_index || 0]
    );

    // Retourner le média créé avec son ID
    const [newMedia]: any = await connection.execute(
      'SELECT * FROM announcements_media WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newMedia[0]);
  } catch (error) {
    console.error('Error adding media to announcement:', error);
    res.status(500).json({
      error: 'Failed to add media to announcement',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    if (connection) connection.release();
  }
});

// DELETE supprimer un média d'une annonce
router.delete('/announcements/:announcementId/media/:mediaId', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const { announcementId, mediaId } = req.params;
    console.log('Deleting announcement media:', mediaId, 'from announcement:', announcementId);

    connection = await pool.getConnection();
    
    // Vérifier que le média appartient bien à cette annonce
    const [media]: any = await connection.execute(
      'SELECT * FROM announcements_media WHERE id = ? AND announcement_id = ?',
      [mediaId, announcementId]
    );

    if (media.length === 0) {
      return res.status(404).json({ error: 'Media not found' });
    }

    await connection.execute('DELETE FROM announcements_media WHERE id = ?', [mediaId]);

    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Error deleting announcement media:', error);
    res.status(500).json({
      error: 'Failed to delete media',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    if (connection) connection.release();
  }
});

// GET une annonce par ID - DOIT être APRÈS toutes les routes avec /announcements/:id/*
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
    
    // Supprimer d'abord les médias associés
    await connection.execute('DELETE FROM announcements_media WHERE announcement_id = ?', [id]);
    
    // Puis supprimer l'annonce
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