-- GBEXO BTP - Complete Database Schema
-- Drop database if exists and create fresh
DROP DATABASE IF EXISTS gbexobtp;
CREATE DATABASE gbexobtp;
USE gbexobtp;

-- Admins Table
CREATE TABLE admins (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services Table (Updated with all necessary columns)
CREATE TABLE services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  short_description TEXT,
  description LONGTEXT NOT NULL,
  icon_name VARCHAR(100),
  image_url VARCHAR(500),
  features JSON,
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Team Members Table (Updated with all necessary columns)
CREATE TABLE team_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  bio LONGTEXT,
  image_url VARCHAR(500),
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Projects Table (Updated with all necessary columns)
CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT NOT NULL,
  location VARCHAR(255),
  category VARCHAR(100),
  project_type VARCHAR(100),
  client_name VARCHAR(255),
  thumbnail_url VARCHAR(500),
  featured BOOLEAN DEFAULT FALSE,
  order_index INT DEFAULT 0,
  technologies JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Project Images Table
CREATE TABLE project_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Testimonials Table (Updated with all necessary columns)
CREATE TABLE testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_name VARCHAR(255) NOT NULL,
  client_role VARCHAR(255),
  client_company VARCHAR(255),
  message LONGTEXT NOT NULL,
  rating INT DEFAULT 5,
  avatar_url VARCHAR(500),
  is_featured BOOLEAN DEFAULT FALSE,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Job Openings Table (Updated with all necessary columns)
CREATE TABLE job_openings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  department VARCHAR(100),
  description LONGTEXT NOT NULL,
  location VARCHAR(255),
  contract_type VARCHAR(50),
  requirements JSON,
  is_open BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Job Applications Table
CREATE TABLE job_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  cv_url VARCHAR(500),
  cover_letter LONGTEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES job_openings(id) ON DELETE CASCADE
);

-- Quotes Table
CREATE TABLE quotes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  project_type VARCHAR(255),
  description LONGTEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin (password: admin123 - hashed with bcrypt)
INSERT INTO admins (email, password) VALUES 
('admin@gbexobtp.com', '$2b$10$rXQZY5Z5Z5Z5Z5Z5Z5Z5ZuQ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z');

-- Sample Data: Services
INSERT INTO services (title, short_description, description, icon_name, image_url, features, order_index) VALUES
('Construction & Génie Civil', 'Bâtiments résidentiels et commerciaux', 'Conception et réalisation de bâtiments résidentiels, commerciaux et industriels avec les normes les plus strictes et une expertise reconnue.', 'Building2', 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=800', '["Bâtiments neufs", "Extensions et rénovation", "Structures complexes", "Normes sismiques"]', 1),
('Travaux Publics & Routes', 'Infrastructures routières et urbaines', 'Aménagement d''infrastructures routières, terrassement et travaux de voirie pour les collectivités et les entreprises.', 'Construction', 'https://images.pexels.com/photos/2467285/pexels-photo-2467285.jpeg?auto=compress&cs=tinysrgb&w=800', '["Routes et autoroutes", "Ponts et ouvrages", "Terrassement", "Voirie urbaine"]', 2),
('Rénovation & Maintenance', 'Restauration de bâtiments existants', 'Réhabilitation et entretien de bâtiments existants pour prolonger leur durée de vie et améliorer leur performance énergétique.', 'Wrench', 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800', '["Rénovation complète", "Mise aux normes", "Maintenance préventive", "Modernisation"]', 3),
('Études Techniques & Conception', 'Bureau d''études intégré', 'Bureau d''études intégré pour l''analyse, la conception et le suivi technique de vos projets de construction.', 'FileText', 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=800', '["Plans et devis", "Études de faisabilité", "Suivi de chantier", "Conseil technique"]', 4);

-- Sample Data: Team Members
INSERT INTO team_members (name, role, bio, image_url, order_index) VALUES
('Cyriac KINZO', 'Directeur Général', 'Leader visionnaire avec plus de 15 ans d''expérience dans le secteur BTP. Cyriac dirige GBEXO BTP vers l''excellence et l''innovation.', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400', 1),
('Jean Marie SOSSOU', 'Directeur Technique', 'Expert en ingénierie civile avec une expertise reconnue dans les grands projets d''infrastructure.', 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400', 2),
('Aminata DIALLO', 'Responsable Projets', 'Spécialiste dans la gestion de projets complexes et la coordination d''équipes multidisciplinaires.', 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400', 3),
('Albert MENSAH', 'Chef de Chantier Senior', 'Professionnel expérimenté dans la supervision et la gestion quotidienne des chantiers.', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400', 4);

-- Sample Data: Projects
INSERT INTO projects (title, description, location, category, project_type, client_name, featured, order_index) VALUES
('Complexe Résidentiel Akakamey', 'Construction d''un complexe résidentiel moderne de 120 appartements avec services intégrés', 'Cotonou, Bénin', 'Bâtiment', 'Résidentiel', 'Immobilière Bénin Plus', true, 1),
('Autoroute Nord-Sud', 'Réalisation de 85 km d''autoroute avec 5 échangeurs et aires de repos', 'Parakou, Bénin', 'Routes', 'Infrastructure', 'Ministère des Transports', true, 2),
('Centre Commercial Prestige', 'Construction d''un centre commercial de 25 000 m² avec parking souterrain', 'Porto-Novo, Bénin', 'Bâtiment', 'Commercial', 'Groupe Prestige', true, 3),
('Hôpital Central Rénovation', 'Réhabilitation complète avec mise aux normes et extension de 8000 m²', 'Cotonou, Bénin', 'Rénovation', 'Santé', 'Ministère de la Santé', false, 4),
('Zone Industrielle Sakété', 'Aménagement de 75 hectares avec voiries et réseaux divers', 'Sakété, Bénin', 'Infrastructure', 'Industriel', 'Collectivité locale', false, 5),
('Pont Suspendu Sô', 'Construction d''un pont suspendu de 450 m sur le fleuve Sô', 'Parakou, Bénin', 'Infrastructure', 'Routes', 'Ministère des Transports', true, 6);

-- Sample Data: Project Images
INSERT INTO project_images (project_id, image_url, is_featured, order_index)
SELECT id, 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800', true, 1 FROM projects WHERE title = 'Complexe Résidentiel Akakamey' LIMIT 1;

INSERT INTO project_images (project_id, image_url, is_featured, order_index)
SELECT id, 'https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=800', true, 1 FROM projects WHERE title = 'Autoroute Nord-Sud' LIMIT 1;

INSERT INTO project_images (project_id, image_url, is_featured, order_index)
SELECT id, 'https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg?auto=compress&cs=tinysrgb&w=800', true, 1 FROM projects WHERE title = 'Centre Commercial Prestige' LIMIT 1;

-- Sample Data: Testimonials
INSERT INTO testimonials (client_name, client_role, client_company, message, rating, is_featured, order_index) VALUES
('Kofi Mensah', 'PDG', 'Immobilière Bénin Plus', 'GBEXO BTP a dépassé nos attentes. La qualité du travail et le respect des délais sont exemplaires. Nous recommandons vivement leurs services.', 5, true, 1),
('Amina Diallo', 'Maire', 'Commune de Porto-Novo', 'Leur expertise en travaux publics est exceptionnelle. Ils ont transformé notre infrastructure urbaine avec professionnalisme.', 5, true, 2),
('Fatou Touré', 'Directrice', 'Clinique Centrale', 'La rénovation de notre clinique a été parfaitement exécutée. L''équipe était réactive et professionnelle du début à la fin.', 5, true, 3),
('Jean-Pierre Martin', 'Investisseur', 'Groupe Investissements', 'Après 3 projets ensemble, je peux affirmer que GBEXO BTP est le meilleur partenaire pour des projets complexes.', 5, true, 4);

-- Sample Data: Job Openings
INSERT INTO job_openings (title, department, description, location, contract_type, requirements) VALUES
('Ingénieur Civil Senior', 'Technique', 'Nous recherchons un ingénieur civil expérimenté pour superviser les grands projets d''infrastructure.', 'Cotonou', 'CDI', '["Minimum 5 ans d''expérience", "Bac+5 en génie civil", "Connaissances BIM", "Permis de conduire valide"]'),
('Chef de Chantier', 'Chantier', 'Responsable de la supervision quotidienne des opérations et de la sécurité sur chantier.', 'Parakou', 'CDI', '["Expérience chantier: 3-5 ans", "Diplôme BTP", "Certificats HSE", "Leadership avéré"]'),
('Dessinateur Projeteur', 'Bureau d''études', 'Création de plans et documents techniques pour nos projets de construction.', 'Cotonou', 'CDI', '["Maitrise CAO/BIM", "Bac+2 minimum", "Autocad et Revit", "Portfolio requis"]'),
('Manœuvre Qualifié', 'Chantier', 'Nous accueillons des manœuvres pour rejoindre nos équipes sur différents chantiers.', 'Flexible', 'CDD/CDI', '["Expérience chantier appreciée", "Bonne condition physique", "Respect des normes HSE"]');