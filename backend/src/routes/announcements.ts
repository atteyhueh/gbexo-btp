// routes/announcements.ts
import express, { Request, Response, NextFunction } from 'express';
import { db } from '../libs/mysql';

const router = express.Router();

// Type pour les annonces
interface Announcement {
  id: number;
  title: string;
  content: string;
  link_url?: string;
  is_urgent: boolean;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// Middleware d'authentification admin
const authenticateAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  // Ajoutez votre logique de vérification du token ici
  next();
};

// GET annonces urgentes (DOIT être avant /announcements/:id)
router.get('/announcements/urgent', async (req: Request, res: Response) => {
  try {
    const announcements = await db.getUrgentAnnouncements();
    res.json(announcements);
  } catch (error) {
    console.error('Error fetching urgent announcements:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// GET nombre d'annonces (DOIT être avant /announcements/:id)
router.get('/announcements/count', async (req: Request, res: Response) => {
  try {
    const count = await db.getAnnouncementsCount();
    res.json({ count });
  } catch (error) {
    console.error('Error fetching announcements count:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// GET toutes les annonces actives
router.get('/announcements', async (req: Request, res: Response) => {
  try {
    const announcements = await db.getAnnouncements();
    res.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// GET une annonce par ID
router.get('/announcements/:id', async (req: Request, res: Response) => {
  try {
    const announcement = await db.getAnnouncementById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ error: 'Annonce non trouvée' });
    }
    res.json(announcement);
  } catch (error) {
    console.error('Error fetching announcement by ID:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// POST créer une annonce (admin uniquement)
router.post('/announcements', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const result = await db.createAnnouncement(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// PUT mettre à jour une annonce (admin uniquement)
router.put('/announcements/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const result = await db.updateAnnouncement(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// DELETE supprimer une annonce (admin uniquement)
router.delete('/announcements/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const result = await db.deleteAnnouncement(req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

export default router;