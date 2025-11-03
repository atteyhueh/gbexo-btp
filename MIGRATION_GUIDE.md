# Guide de Migration: Supabase vers MySQL + Express.js

## Résumé des Changements

L'application a été migrée de Supabase (PostgreSQL) vers un backend Express.js avec MySQL.

### Architecture Nouvelle

```
Frontend (React/Vite) → Backend (Express.js) → MySQL (Hostinger)
```

## Structure du Projet

```
project/
├── src/                    # Frontend React
│   ├── lib/api.ts         # Client API (nouveau)
│   ├── contexts/          # Auth avec JWT
│   └── hooks/             # Hooks mises à jour
├── backend/               # Backend Express.js
│   ├── src/
│   │   ├── config/        # Config MySQL
│   │   ├── middleware/    # Auth middleware
│   │   ├── routes/        # Routes API
│   │   ├── utils/         # Utilitaires JWT
│   │   └── index.ts       # Serveur Express
│   ├── database.sql       # Schéma MySQL
│   ├── .env              # Variables d'env backend
│   ├── package.json      # Dépendances backend
│   └── SETUP.md          # Guide d'installation backend
└── .env                  # Variables d'env frontend
```

## Installation Locale

### 1. Frontend

```bash
# L'app est déjà configurée
npm install
npm run build
```

### 2. Backend

```bash
cd backend
npm install
```

### 3. Base de Données MySQL

**Avec MySQL CLI:**
```bash
mysql -u root < database.sql
```

**Ou manuellement:**
- Ouvrir MySQL Workbench ou phpMyAdmin
- Exécuter le fichier `backend/database.sql`

### 4. Créer Admin Par Défaut

```bash
cd backend
npm run dev -- src/scripts/init-admin.ts
```

**Credentials par défaut:**
- Email: `admin@gbexobtp.com`
- Password: `Admin1234!`

### 5. Lancer le Backend

```bash
cd backend
npm run dev
```

Serveur disponible: `http://localhost:5000`

### 6. Vérifier le Health

```bash
curl http://localhost:5000/health
# Retourne: {"status":"ok"}
```

## Endpoints API

### Authentification
- `POST /api/auth/login` - Se connecter
- `POST /api/auth/logout` - Se déconnecter (token requis)

### Projets
- `GET /api/projects` - Tous les projets
- `GET /api/projects/:id` - Détail + images
- `POST /api/projects` - Créer (token requis)
- `PUT /api/projects/:id` - Modifier (token requis)
- `DELETE /api/projects/:id` - Supprimer (token requis)

### Services
- `GET /api/services` - Tous les services actifs
- `POST /api/services` - Créer (token requis)
- `PUT /api/services/:id` - Modifier (token requis)
- `DELETE /api/services/:id` - Supprimer (token requis)

### Jobs
- `GET /api/jobs` - Toutes les offres ouvertes
- `GET /api/jobs/:id` - Détail offre
- `POST /api/jobs` - Créer (token requis)
- `PUT /api/jobs/:id` - Modifier (token requis)
- `DELETE /api/jobs/:id` - Supprimer (token requis)

## Variables d'Environnement

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api  # URL du backend
```

### Backend (.env)
```
DB_HOST=localhost           # Hôte MySQL
DB_USER=root               # Utilisateur MySQL
DB_PASSWORD=               # Password MySQL
DB_NAME=gbexobtp           # Nom de la base
DB_PORT=3306               # Port MySQL
JWT_SECRET=...             # Secret JWT (changez-le!)
PORT=5000                  # Port Express
NODE_ENV=development       # Environnement
```

## Déploiement sur Hostinger

### 1. Configuration MySQL

1. Accéder au panneau Hostinger
2. Créer une nouvelle base de données MySQL
3. Copier les credentials:
   - Hostname
   - Username
   - Password
   - Database name
   - Port (généralement 3306)

### 2. Importer le Schéma

1. Ouvrir phpMyAdmin (Hostinger)
2. Sélectionner la base de données
3. Importer `backend/database.sql`

### 4. Déployer le Backend

#### Via Git + NPM (Recommandé)

1. Pousser le code vers GitHub
2. Dans Hostinger:
   - Aller à "Git Push Deploy"
   - Connecter votre repo
3. Configurer les variables d'environnement:
   ```
   DB_HOST=your-hostinger-host
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   DB_NAME=your-db-name
   JWT_SECRET=your-super-secret-key-change-this
   PORT=5000
   NODE_ENV=production
   ```
4. Installer les dépendances: `npm install --production`
5. Lancer: `npm start`

#### Via FTP

1. Télécharger `backend/` via FTP
2. Configurer `.env` avec les credentials Hostinger
3. SSH:
   ```bash
   cd backend
   npm install --production
   npm start
   ```

### 5. Configurer le Frontend

1. Mettre à jour `.env`:
   ```
   VITE_API_URL=https://votre-domaine.com/api
   ```
2. Déployer le frontend vers Hostinger

### 6. CORS (Optionnel)

Si CORS cause des problèmes:
- Le backend permet déjà les requêtes de n'importe quelle origine
- À sécuriser en production: modifier `cors()` dans `backend/src/index.ts`

## Fonctionnalités

✅ Authentification JWT
✅ CRUD Projets
✅ CRUD Services
✅ CRUD Offres d'emploi
✅ Base MySQL
✅ API RESTful
✅ Protection des routes (token requis)

## Changements du Frontend

### Avant (Supabase)
```typescript
import { supabase } from '../lib/supabase';
const { data } = await supabase.from('projects').select('*');
```

### Après (API)
```typescript
import { api } from '../lib/api';
const projects = await api.projects.list();
```

### Authentification

**Avant:**
```typescript
await supabase.auth.signInWithPassword({ email, password });
```

**Après:**
```typescript
await api.auth.login(email, password);
// Token sauvegardé automatiquement
```

## Support

Pour toute question sur la migration:
1. Vérifier `backend/SETUP.md` pour le backend
2. Vérifier `MIGRATION_GUIDE.md` (ce fichier)
3. Consulter les logs des erreurs

## Notes Importantes

- Les tokens JWT expirent après 7 jours
- Toutes les requêtes authentifiées nécessitent le header: `Authorization: Bearer <token>`
- Le frontend stocke le token dans `localStorage` (clé: `auth_token`)
- En production, utiliser HTTPS partout
