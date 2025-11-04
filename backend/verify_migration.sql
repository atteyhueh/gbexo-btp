-- Script de vérification après migration
USE gbexobtp;

-- Vérifier les types de colonnes
SELECT
    'services' as table_name,
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'gbexobtp'
AND TABLE_NAME = 'services'
AND COLUMN_NAME = 'image_url';

SELECT
    'team_members' as table_name,
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'gbexobtp'
AND TABLE_NAME = 'team_members'
AND COLUMN_NAME = 'image_url';

SELECT
    'projects' as table_name,
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'gbexobtp'
AND TABLE_NAME = 'projects'
AND COLUMN_NAME = 'thumbnail_url';

SELECT
    'testimonials' as table_name,
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'gbexobtp'
AND TABLE_NAME = 'testimonials'
AND COLUMN_NAME = 'avatar_url';

-- Vérifier qu'il n'y a plus de data URLs
SELECT
    'Services with data URLs' as check_name,
    COUNT(*) as count
FROM services
WHERE image_url LIKE 'data:image%';

SELECT
    'Team members with data URLs' as check_name,
    COUNT(*) as count
FROM team_members
WHERE image_url LIKE 'data:image%';

SELECT
    'Projects with data URLs' as check_name,
    COUNT(*) as count
FROM projects
WHERE thumbnail_url LIKE 'data:image%';

-- Afficher un échantillon des URLs après migration
SELECT
    'Services URLs' as sample_type,
    id,
    title,
    LEFT(image_url, 60) as url_preview
FROM services
LIMIT 3;

SELECT
    'Team URLs' as sample_type,
    id,
    name,
    LEFT(image_url, 60) as url_preview
FROM team_members
LIMIT 3;

SELECT '✅ Vérification terminée - Tous les types doivent être TEXT et aucune data URL ne doit exister' as result;
