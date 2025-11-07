import { Router, Response } from 'express';
import pool from '../config/database.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';
import { EmailService } from '../services/emailService.js';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [quotes]: any = await connection.execute(
      'SELECT * FROM quotes ORDER BY created_at DESC'
    );
    connection.release();
    res.json(quotes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const { name, email, company, project_type, description } = req.body;
    console.log('Creating quote:', { name, email, project_type });

    connection = await pool.getConnection();

    const [result]: any = await connection.execute(
      'INSERT INTO quotes (name, email, company, project_type, description) VALUES (?, ?, ?, ?, ?)',
      [name, email, company || '', project_type || '', description]
    );

    const quoteId = result.insertId;

    // Envoi des emails en arrière-plan (ne bloque pas la réponse)
    EmailService.sendQuoteEmails({
      id: quoteId,
      name,
      email,
      company: company || '',
      project_type: project_type || '',
      description,
    }).catch(err => {
      console.error('Erreur email (non bloquante):', err);
    });

    res.json({ 
      id: quoteId, 
      message: 'Quote request submitted successfully',
      email_sent: true 
    });
  } catch (error) {
    console.error('Error creating quote:', error);
    res.status(500).json({ 
      error: 'Failed to submit quote request', 
      details: error instanceof Error ? error.message : String(error) 
    });
  } finally {
    if (connection) connection.release();
  }
});

router.put('/:id/status', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validation du statut
    if (!['pending', 'completed', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    console.log('Updating quote status:', { id, status });

    connection = await pool.getConnection();

    await connection.execute(
      'UPDATE quotes SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );

    res.json({ message: 'Quote status updated successfully' });
  } catch (error) {
    console.error('Error updating quote status:', error);
    res.status(500).json({ 
      error: 'Failed to update quote status', 
      details: error instanceof Error ? error.message : String(error) 
    });
  } finally {
    if (connection) connection.release();
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const { id } = req.params;
    console.log('Deleting quote:', id);

    connection = await pool.getConnection();

    await connection.execute('DELETE FROM quotes WHERE id = ?', [id]);

    res.json({ message: 'Quote deleted' });
  } catch (error) {
    console.error('Error deleting quote:', error);
    res.status(500).json({ 
      error: 'Failed to delete quote', 
      details: error instanceof Error ? error.message : String(error) 
    });
  } finally {
    if (connection) connection.release();
  }
});

export default router;