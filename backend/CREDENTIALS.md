# Credentials et Configuration

## Admin Créé par Défaut

```
npm run init-admin
Email: admin@gbexobtp.com
Password: Admin1234!
```

## Configuration Locale

### Frontend (.env)
```
Get-Content database.sql | & "C:\xampp\mysql\bin\mysql.exe" -u root
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=gbexobtp
DB_PORT=3306

JWT_SECRET=your_jwt_secret_key_change_this_in_production_12345678

PORT=5000
NODE_ENV=development
```

## URLs de Test

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/health
- Admin Login: http://localhost:5173/admin/login

## Test Login avec curl

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gbexobtp.com",
    "password": "Admin1234!"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "xxxxx",
    "email": "admin@gbexobtp.com"
  }
}
```

## Test Requête Authentifiée

```bash
curl http://localhost:5000/api/projects \
  -H "Authorization: Bearer <TOKEN_ICI>"
```

## Hostinger Configuration

Vous fournirez ces informations lors du déploiement:

- DB_HOST: (fourni par Hostinger)
- DB_USER: (fourni par Hostinger)
- DB_PASSWORD: (fourni par Hostinger)
- DB_NAME: (créé par vous)
- JWT_SECRET: (génèrez une longue chaîne aléatoire)
- PORT: (généralement 5000 ou dynamique)

## Sécurité

⚠️ **IMPORTANT AVANT PRODUCTION:**

1. Changer `JWT_SECRET` par une valeur longue et aléatoire
2. Changer le password de l'admin
3. Activer HTTPS
4. Limiter CORS si besoin
5. Configurer des variables d'env sécurisées sur Hostinger

## Réinitialiser Admin

Pour créer un nouvel admin ou changer le password:

```bash
npm run dev -- src/scripts/init-admin.ts
```

Cela crée toujours: `admin@gbexobtp.com` / `Admin1234!`

Pour modifier le script, éditer: `backend/src/scripts/init-admin.ts`
