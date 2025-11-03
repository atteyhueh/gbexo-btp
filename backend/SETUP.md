# Configuration du Backend

## 1. Installation des dépendances

```bash
cd backend
npm install
```

## 2. Configuration MySQL Local

### Sur Windows/Mac/Linux avec MySQL installé:

1. Créer la base de données:
```bash
mysql -u root
```

Dans MySQL shell:
```sql
SOURCE database.sql;
EXIT;
```

Ou utiliser MySQL Workbench pour exécuter `database.sql`

### Vérifier la connexion:
```bash
mysql -u root gbexobtp
```

## 3. Créer l'admin par défaut

```bash
npm run dev -- src/scripts/init-admin.ts
```

Cela créera un compte admin:
- Email: `admin@gbexobtp.com`
- Password: `Admin1234!`

## 4. Lancer le serveur

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

## 5. Vérifier que tout marche

```bash
curl http://localhost:5000/health
```

Devrait retourner: `{"status":"ok"}`

## Variables d'environnement (.env)

```
DB_HOST=localhost        # Hôte MySQL
DB_USER=root            # Utilisateur MySQL
DB_PASSWORD=            # Password MySQL (vide par défaut)
DB_NAME=gbexobtp        # Nom base de données
DB_PORT=3306            # Port MySQL
JWT_SECRET=...          # Secret pour tokens JWT
PORT=5000               # Port du serveur
NODE_ENV=development    # Environnement
```

## Routes API

### Authentification
- `POST /api/auth/login` - Se connecter
- `POST /api/auth/logout` - Se déconnecter

### Projets
- `GET /api/projects` - Lister les projets
- `GET /api/projects/:id` - Détail projet
- `POST /api/projects` - Créer projet (auth)
- `PUT /api/projects/:id` - Modifier projet (auth)
- `DELETE /api/projects/:id` - Supprimer projet (auth)

### Services
- `GET /api/services` - Lister les services
- `POST /api/services` - Créer service (auth)
- `PUT /api/services/:id` - Modifier service (auth)
- `DELETE /api/services/:id` - Supprimer service (auth)

### Jobs
- `GET /api/jobs` - Lister les offres d'emploi
- `GET /api/jobs/:id` - Détail offre
- `POST /api/jobs` - Créer offre (auth)
- `PUT /api/jobs/:id` - Modifier offre (auth)
- `DELETE /api/jobs/:id` - Supprimer offre (auth)

## Déploiement sur Hostinger

1. Accéder au panneau Hostinger
2. Créer une base MySQL
3. Configurer Node.js
4. Copier les fichiers du backend
5. Installer dépendances: `npm install --production`
6. Configurer les variables d'environnement avec les credentials Hostinger
7. Lancer: `npm start`
