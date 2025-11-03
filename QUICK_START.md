# Démarrage Rapide - MySQL + Express.js

## En 5 Étapes

### 1️⃣ Setup Frontend
```bash
npm install
npm run build
```

### 2️⃣ Setup Backend
```bash
cd backend
npm install
```

### 3️⃣ Créer la Base de Données
```bash
mysql -u root < database.sql
```

### 4️⃣ Créer l'Admin
```bash
npm run dev -- src/scripts/init-admin.ts
```

Credentials:
- **Email:** admin@gbexobtp.com
- **Password:** Admin1234!

### 5️⃣ Lancer les Serveurs

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

---

## URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Admin: `http://localhost:5173/admin/login`

---

## Credentials pour Tester

```
Email: admin@gbexobtp.com
Password: Admin1234!
```

---

## Structure Créée

- ✅ Backend Express.js avec routes API
- ✅ MySQL avec tables (projects, services, jobs, etc.)
- ✅ Authentification JWT
- ✅ Admin par défaut
- ✅ Frontend mises à jour pour utiliser l'API

---

## Pour le Déploiement Hostinger

Lire: `MIGRATION_GUIDE.md` → Section "Déploiement sur Hostinger"

---

## Problèmes Courants

**Erreur de connexion MySQL?**
- Vérifier: `mysql -u root` fonctionne
- Ou modifier `DB_PASSWORD` dans `backend/.env`

**Port 5000 déjà utilisé?**
- Changer `PORT` dans `backend/.env`
- Mettre à jour `VITE_API_URL` dans `.env` du frontend

**Token invalid?**
- Recréer l'admin: `npm run dev -- src/scripts/init-admin.ts`
- Ou changer `JWT_SECRET` dans `.env`
