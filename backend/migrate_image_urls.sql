-- Migration pour corriger les colonnes image_url
-- Exécuter cette migration sur votre base de données existante

USE gbexobtp;

-- Augmenter la taille des colonnes image_url de VARCHAR(500) à TEXT
ALTER TABLE services MODIFY COLUMN image_url TEXT;
ALTER TABLE team_members MODIFY COLUMN image_url TEXT;
ALTER TABLE projects MODIFY COLUMN thumbnail_url TEXT;
ALTER TABLE project_images MODIFY COLUMN image_url TEXT;
ALTER TABLE testimonials MODIFY COLUMN avatar_url TEXT;
ALTER TABLE job_applications MODIFY COLUMN cv_url TEXT;
ALTER TABLE announcements MODIFY COLUMN cover_image_url TEXT;

-- Nettoyer les data URLs trop volumineuses (si elles existent)
-- Remplacer par des images par défaut de Pexels
UPDATE services
SET image_url = 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=800'
WHERE image_url LIKE 'data:image%' OR image_url IS NULL OR image_url = '';

UPDATE team_members
SET image_url = 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
WHERE image_url LIKE 'data:image%' OR image_url IS NULL OR image_url = '';

UPDATE projects
SET thumbnail_url = 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
WHERE thumbnail_url LIKE 'data:image%' OR thumbnail_url IS NULL OR thumbnail_url = '';

UPDATE testimonials
SET avatar_url = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200'
WHERE avatar_url LIKE 'data:image%' OR avatar_url IS NULL OR avatar_url = '';

UPDATE announcements
SET cover_image_url = 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800'
WHERE cover_image_url LIKE 'data:image%' OR cover_image_url IS NULL OR cover_image_url = '';

SELECT 'Migration completed successfully!' AS status;
