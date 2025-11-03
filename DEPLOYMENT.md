# Guide de Déploiement - GBEXO BTP

## Prérequis

- Node.js 18+ installé
- Compte Supabase configuré
- Variables d'environnement configurées

## Configuration initiale

### 1. Variables d'environnement

Créez un fichier `.env` à la racine du projet:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Installation des dépendances

```bash
npm install
```

### 3. Configuration Supabase

Les migrations sont déjà créées dans `supabase/migrations/`:
- `001_create_initial_schema.sql` - Schéma de base de données
- `002_insert_sample_data.sql` - Données d'exemple
- `003_setup_storage.sql` - Configuration du storage pour fichiers

Appliquez les migrations via Supabase Dashboard ou CLI.

### 4. Création du compte admin

Pour accéder au dashboard admin (`/admin/dashboard`), créez un utilisateur via Supabase Auth:

1. Allez dans Supabase Dashboard > Authentication > Users
2. Créez un nouvel utilisateur avec email/password
3. Utilisez ces credentials pour vous connecter sur `/admin/login`

## Développement local

```bash
npm run dev
```

Le site sera accessible sur `http://localhost:5173`

## Build de production

```bash
npm run build
```

Les fichiers de production seront dans le dossier `dist/`

## Déploiement

### Option 1: Vercel (Recommandé)

1. Connectez votre repository GitHub à Vercel
2. Configurez les variables d'environnement dans Vercel Dashboard
3. Déployez automatiquement à chaque push

### Option 2: Netlify

1. Connectez votre repository à Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Configurez les variables d'environnement

### Option 3: Serveur personnalisé

1. Buildez le projet: `npm run build`
2. Uploadez le contenu du dossier `dist/` sur votre serveur
3. Configurez un serveur web (Nginx/Apache) pour servir les fichiers statiques

## Fonctionnalités implémentées

### Interface publique
- ✅ Page d'accueil avec hero animé
- ✅ Page Services
- ✅ Page Projets avec filtres avancés et recherche
- ✅ Page Détails projet
- ✅ Page À propos avec biographie DG et chronologie
- ✅ Page Carrières avec upload de CV
- ✅ Formulaire de contact avec Supabase
- ✅ Dark mode
- ✅ SEO optimisé pour le Bénin

### Dashboard Admin
- ✅ Authentification sécurisée (Supabase Auth)
- ✅ Vue d'ensemble avec statistiques
- ✅ Gestion des projets (CRUD complet)
- ✅ Gestion des services
- ✅ Gestion de l'équipe
- ✅ Gestion des témoignages
- ✅ Consultation des demandes de devis
- ✅ Gestion des offres d'emploi

### Upload de fichiers
- ✅ Upload de CV pour candidatures
- ✅ Storage sécurisé avec Supabase Storage
- ✅ Support PDF, DOC, DOCX

## Informations importantes

- **Localisation**: Toutes les informations sont configurées pour le Bénin (Cotonou)
- **Téléphone**: +229 (indicatif Bénin)
- **Adresse**: Boulevard de la Marina, Cotonou, Bénin
- **DG**: Cyriaque KINZO

## Support

Pour toute question technique, consultez la documentation:
- [Supabase Docs](https://supabase.com/docs)
- [Vite Docs](https://vitejs.dev)
- [React Router Docs](https://reactrouter.com)

## Licence

Propriétaire - GBEXO BTP © 2024
