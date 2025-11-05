-- Migration: Add Multi-Media Support System
-- Purpose: Add tables for multi-media uploads (photos/videos) for announcements, services, and projects

USE gbexobtp;

-- 1. Create announcements_media table
CREATE TABLE IF NOT EXISTS announcements_media (
  id INT AUTO_INCREMENT PRIMARY KEY,
  announcement_id INT NOT NULL,
  media_url TEXT NOT NULL,
  media_type ENUM('image', 'video') DEFAULT 'image',
  is_featured BOOLEAN DEFAULT FALSE,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (announcement_id) REFERENCES announcements(id) ON DELETE CASCADE,
  INDEX idx_announcement_id (announcement_id),
  INDEX idx_order_index (order_index)
);

-- 2. Create services_media table
CREATE TABLE IF NOT EXISTS services_media (
  id INT AUTO_INCREMENT PRIMARY KEY,
  service_id INT NOT NULL,
  media_url TEXT NOT NULL,
  media_type ENUM('image', 'video') DEFAULT 'image',
  is_featured BOOLEAN DEFAULT FALSE,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  INDEX idx_service_id (service_id),
  INDEX idx_order_index (order_index)
);

-- 3. Add columns to announcements table if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'announcements' AND COLUMN_NAME = 'short_description'
  ) THEN
    ALTER TABLE announcements ADD COLUMN short_description TEXT AFTER title;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'announcements' AND COLUMN_NAME = 'related_job_id'
  ) THEN
    ALTER TABLE announcements ADD COLUMN related_job_id INT AFTER link_url;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'announcements' AND COLUMN_NAME = 'related_service_id'
  ) THEN
    ALTER TABLE announcements ADD COLUMN related_service_id INT AFTER related_job_id;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'announcements' AND COLUMN_NAME = 'related_project_id'
  ) THEN
    ALTER TABLE announcements ADD COLUMN related_project_id INT AFTER related_service_id;
  END IF;
END $$;

-- 4. Update project_images to support videos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'project_images' AND COLUMN_NAME = 'media_type'
  ) THEN
    ALTER TABLE project_images
    ADD COLUMN media_type ENUM('image', 'video') DEFAULT 'image' AFTER image_url,
    CHANGE COLUMN image_url media_url TEXT NOT NULL;
  END IF;
END $$;

-- 5. Add columns to projects table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'projects' AND COLUMN_NAME = 'budget'
  ) THEN
    ALTER TABLE projects ADD COLUMN budget VARCHAR(100) AFTER technologies;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'projects' AND COLUMN_NAME = 'team_size'
  ) THEN
    ALTER TABLE projects ADD COLUMN team_size INT AFTER budget;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'projects' AND COLUMN_NAME = 'duration_months'
  ) THEN
    ALTER TABLE projects ADD COLUMN duration_months INT AFTER team_size;
  END IF;
END $$;

-- 6. Update announcements cover_image_url to TEXT
ALTER TABLE announcements MODIFY COLUMN cover_image_url TEXT;

-- Sample data for announcements_media (optional)
INSERT INTO announcements_media (announcement_id, media_url, media_type, is_featured, order_index)
SELECT
  id,
  cover_image_url,
  'image',
  TRUE,
  0
FROM announcements
WHERE cover_image_url IS NOT NULL
AND NOT EXISTS (
  SELECT 1 FROM announcements_media WHERE announcement_id = announcements.id
);

SELECT 'Multi-media system migration completed successfully!' AS status;
