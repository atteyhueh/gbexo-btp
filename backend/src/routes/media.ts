import express, { Router } from 'express';
import pool from '../config/database.js';

const router = Router();

// Announcements Media
router.get('/announcements/:announcementId/media', async (req, res) => {
  try {
    const { announcementId } = req.params;
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM announcements_media WHERE announcement_id = ? ORDER BY order_index ASC',
      [announcementId]
    );
    connection.release();
    res.json(rows || []);
  } catch (error) {
    console.error('Error fetching announcement media:', error);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

router.post('/announcements/:announcementId/media', async (req, res) => {
  try {
    const { announcementId } = req.params;
    const { media } = req.body;

    const connection = await pool.getConnection();

    // Delete existing media if needed
    await connection.query(
      'DELETE FROM announcements_media WHERE announcement_id = ?',
      [announcementId]
    );

    // Insert new media
    if (media && Array.isArray(media)) {
      for (const item of media) {
        await connection.query(
          'INSERT INTO announcements_media (announcement_id, media_url, media_type, is_featured, order_index) VALUES (?, ?, ?, ?, ?)',
          [announcementId, item.media_url, item.media_type, item.is_featured ? 1 : 0, item.order_index]
        );
      }
    }

    connection.release();
    res.json({ message: 'Media updated successfully' });
  } catch (error) {
    console.error('Error updating announcement media:', error);
    res.status(500).json({ error: 'Failed to update media' });
  }
});

// Services Media
router.get('/services/:serviceId/media', async (req, res) => {
  try {
    const { serviceId } = req.params;
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM services_media WHERE service_id = ? ORDER BY order_index ASC',
      [serviceId]
    );
    connection.release();
    res.json(rows || []);
  } catch (error) {
    console.error('Error fetching service media:', error);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

router.post('/services/:serviceId/media', async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { media } = req.body;

    const connection = await pool.getConnection();

    // Delete existing media if needed
    await connection.query(
      'DELETE FROM services_media WHERE service_id = ?',
      [serviceId]
    );

    // Insert new media
    if (media && Array.isArray(media)) {
      for (const item of media) {
        await connection.query(
          'INSERT INTO services_media (service_id, media_url, media_type, is_featured, order_index) VALUES (?, ?, ?, ?, ?)',
          [serviceId, item.media_url, item.media_type, item.is_featured ? 1 : 0, item.order_index]
        );
      }
    }

    connection.release();
    res.json({ message: 'Media updated successfully' });
  } catch (error) {
    console.error('Error updating service media:', error);
    res.status(500).json({ error: 'Failed to update media' });
  }
});

// Projects Media (via project_images table)
router.get('/projects/:projectId/media', async (req, res) => {
  try {
    const { projectId } = req.params;
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT id, project_id, media_url as image_url, media_type, is_featured, order_index FROM project_images WHERE project_id = ? ORDER BY order_index ASC',
      [projectId]
    );
    connection.release();
    res.json(rows || []);
  } catch (error) {
    console.error('Error fetching project media:', error);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

router.post('/projects/:projectId/media', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { media } = req.body;

    const connection = await pool.getConnection();

    // Delete existing media if needed
    await connection.query(
      'DELETE FROM project_images WHERE project_id = ?',
      [projectId]
    );

    // Insert new media
    if (media && Array.isArray(media)) {
      for (const item of media) {
        await connection.query(
          'INSERT INTO project_images (project_id, media_url, media_type, is_featured, order_index) VALUES (?, ?, ?, ?, ?)',
          [projectId, item.media_url, item.media_type, item.is_featured ? 1 : 0, item.order_index]
        );
      }
    }

    connection.release();
    res.json({ message: 'Media updated successfully' });
  } catch (error) {
    console.error('Error updating project media:', error);
    res.status(500).json({ error: 'Failed to update media' });
  }
});

export default router;
