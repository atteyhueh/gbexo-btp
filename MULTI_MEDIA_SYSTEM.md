# Système Multi-Média Professionnel - Documentation

## Vue d'ensemble

Système complet d'upload et de gestion de photos et vidéos pour :
- **Annonces** (avec redirection vers Carrières/Services/Projets)
- **Services** (avec redirection vers Devis/Carrières)
- **Projets** (galerie professionnelle complète)

## Architecture

### Bases de Données MySQL

#### Nouvelles Tables

```sql
-- Médias pour les annonces
CREATE TABLE announcements_media (
  id INT AUTO_INCREMENT PRIMARY KEY,
  announcement_id INT NOT NULL,
  media_url TEXT NOT NULL,
  media_type ENUM('image', 'video'),
  is_featured BOOLEAN DEFAULT FALSE,
  order_index INT DEFAULT 0,
  FOREIGN KEY (announcement_id) REFERENCES announcements(id) ON DELETE CASCADE
);

-- Médias pour les services
CREATE TABLE services_media (
  id INT AUTO_INCREMENT PRIMARY KEY,
  service_id INT NOT NULL,
  media_url TEXT NOT NULL,
  media_type ENUM('image', 'video'),
  is_featured BOOLEAN DEFAULT FALSE,
  order_index INT DEFAULT 0,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);
```

#### Colonnes Modifiées

```sql
-- Projets (projet_images table)
-- Colonne image_url renommée à media_url
-- Ajout colonne media_type ENUM('image', 'video')

-- Annonces
ALTER TABLE announcements ADD COLUMN short_description TEXT;
ALTER TABLE announcements ADD COLUMN related_job_id INT;
ALTER TABLE announcements ADD COLUMN related_service_id INT;
ALTER TABLE announcements ADD COLUMN related_project_id INT;
```

### Composants React

#### 1. **MultiMediaUpload.tsx**
Composant réutilisable pour upload multiple de photos/vidéos.

**Fonctionnalités:**
- Upload simultané de plusieurs fichiers
- Support images (JPG, PNG, WebP) et vidéos
- Max 50MB par fichier
- Définir image vedette
- Réorganiser l'ordre
- Aperçu en plein écran

```typescript
<MultiMediaUpload
  value={mediaItems}
  onChange={setMediaItems}
  maxItems={10}
/>
```

#### 2. **Pages Détail**

**AnnouncementDetail.tsx**
- Galerie de médias professionnelle
- Badge URGENT si applicable
- 3 boutons redirection vers:
  - Carrières (si related_job_id)
  - Services (si related_service_id)
  - Projets (si related_project_id)

**ServiceDetail.tsx**
- Galerie de médias
- Caractéristiques principales
- 3 boutons redirection vers:
  - Demander un devis
  - Page devis
  - Voir les carrières

**ProjectDetail.tsx** (Amélioré)
- Support vidéos en plus des images
- Même galerie que les autres pages
- Partage sur réseaux sociaux

### Routes API Backend

```typescript
// Annonces
GET    /api/announcements/:announcementId/media
POST   /api/announcements/:announcementId/media

// Services
GET    /api/services/:serviceId/media
POST   /api/services/:serviceId/media

// Projets
GET    /api/projects/:projectId/media
POST   /api/projects/:projectId/media
```

### Hooks React

```typescript
// Pour annonces
import { useAnnouncementMedia } from '../hooks/useAnnouncementMedia';
const { media, isLoading, error } = useAnnouncementMedia(announcementId);

// Pour services
import { useServiceMedia } from '../hooks/useServiceMedia';
const { media, isLoading, error } = useServiceMedia(serviceId);
```

## Routes Frontend

```typescript
/service/:id          // Détails d'un service
/announcement/:id     // Détails d'une annonce
/project/:id          // Détails d'un projet (amélioré)
```

## Flux d'Upload

### 1. Admin Upload
```
Admin selectionne fichiers
      ↓
MultiMediaUpload traite
      ↓
Upload sur ImgBB (gratuit)
      ↓
URL sauvegardée en MySQL
      ↓
API met à jour base de données
```

### 2. Affichage Public
```
Utilisateur visite page détail
      ↓
Hook charge médias depuis API
      ↓
Galerie affiche images/vidéos
      ↓
Utilisateur clique redirection
      ↓
Naviguer vers page connectée
```

## Gestion des Médias

### Type de Fichiers
- **Images**: JPG, PNG, WebP (recommandé WebP)
- **Vidéos**: MP4, WebM, OGG
- **Taille max**: 50MB par fichier
- **Limite totale**: 10 fichiers par entité

### Hébergement
- Service: **ImgBB** (gratuit et illimité)
- API Key: Déjà configurée
- Pas de limite de bande passante
- URL permanentes

## Interface Admin

### Ajouter des Médias

1. Modifier une annonce/service/projet
2. Section "Médias" avec drag-drop
3. Cliquer "Fichier Local"
4. Sélectionner photos/vidéos
5. Attendre upload (2-5 sec)
6. Voir aperçu
7. Définir vedette si nécessaire
8. Réorganiser avec flèches
9. Sauvegarder

## Exemples de Contenu

### Annonce Recrutement
- Photo/vidéo de l'équipe
- Vidéo présentation entreprise
- Photos environnement de travail
- Lien vers page carrières
- Badge URGENT

### Service
- Photos du service en action
- Vidéo tutoriel/démonstration
- Galerie avant/après
- Lien vers devis
- Lien vers carrières

### Projet
- Toutes photos du projet
- Vidéo du chantier
- Photos détails/progrès
- Avant/après transformation
- Équipe et technologies

## Fonctionnalités Avancées

### Médias Vedette
- Première image affichée par défaut
- Peut être changée au clic
- À définir lors de création

### Galerie Interaktive
- Navigation au clavier (flèches)
- Aperçu plein écran
- Responsive mobile/desktop
- Compteur position (3/10)

### Intégration Réseaux
- Partage Facebook/Twitter/LinkedIn
- URL de la page partagée
- Titre du contenu dans message

## Migration Existante

### Avant
```sql
-- Données anciennes
cover_image_url VARCHAR(500)
image_url TEXT (data URLs)
```

### Après
```sql
-- Nouvelles tables
announcements_media, services_media, project_images
-- URLs ImgBB
https://i.ibb.co/abc123/file.jpg
```

**Migration automatique**: Cover image → Featured media

## Performance

### Optimisations
- Lazy loading des vidéos
- Images WebP compressées
- Cache navigateur
- CDN ImgBB (rapide)

### Temps de Chargement
- Galerie images: < 1s
- Vidéo (streaming): Selon connexion
- Upload fichier: 2-5 sec par fichier

## Sécurité

### Authentification
- Routes API protégées par JWT
- Seul admin peut ajouter/modifier médias
- Public peut voir seulement

### Validation
- Vérification type fichier
- Limite taille fichier
- Validation URL HTTP/HTTPS

## Dépannage

### Upload échoue
1. Vérifier taille (< 50MB)
2. Vérifier format (JPG/PNG/WebP/MP4)
3. Vérifier connexion internet
4. Réessayer

### Vidéo ne joue pas
1. Vérifier format MP4
2. Vérifier navigateur (HTML5)
3. Vérifier URL accessible

### Images non affichées
1. Vérifier URL ImgBB accessible
2. Vérifier paramètres CORS
3. Vider cache navigateur

## Roadmap Future

- [ ] Recadrage images avant upload
- [ ] Filtres images (brightness, contrast)
- [ ] Compression vidéo automatique
- [ ] Génération miniatures
- [ ] Stockage local S3
- [ ] Analytics (vues, engagement)

## Support

Pour l'upload automatique sur ImgBB:
- API Key: `4d755673c2dc94a168dd770852ca7e62`
- Lien: https://imgbb.com/
- Gratuit et illimité

Toutes les URL ImgBB sont permanentes et accessibles.
