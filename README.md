# LearningUpgrade

Plateforme e-learning full-stack avec espace client et espace admin:

- Frontend: React + TypeScript + Vite + Tailwind + shadcn/ui
- Backend: Node.js + Express
- Base de donnees: MySQL
- Authentification: JWT + roles (`admin` / `client`)

---

## 1) Fonctionnalites principales

### Cote client
- Dashboard avec recherche de cours
- My Courses (affiche uniquement les cours deja commences)
- Progress (statistiques + progression detaillee)
- Profil utilisateur (`/profile`) avec modification du nom/mot de passe

### Cote admin
- Dashboard admin avec analytics:
  - liste des clients
  - top cours les plus vus
  - courbe de vues par cours
  - progression/engagement par client
- CRUD Courses
- CRUD Lessons
- Pages dediees de modification:
  - `/admin/catalog/courses/new`
  - `/admin/catalog/courses/:courseId`
  - `/admin/catalog/courses/:courseId/lessons/new`
  - `/admin/catalog/lessons/:lessonId`

---

## 2) Stack technique

- Frontend: `React`, `TypeScript`, `Vite`, `TailwindCSS`, `shadcn/ui`, `Recharts`
- Backend: `Node.js`, `Express`, `mysql2`, `cors`, `dotenv`
- Auth: `jsonwebtoken`, `bcryptjs`
- DB: `MySQL 8+`

---

## 3) Structure du projet

```text
LearningTask/
├─ src/                         # Frontend React
│  ├─ components/
│  ├─ pages/
│  └─ lib/
├─ public/                      # Assets publics (logo, favicon)
├─ backend/
│  ├─ src/
│  │  ├─ routes/
│  │  ├─ services/
│  │  ├─ utils/
│  │  └─ server.js
│  ├─ database/
│  │  ├─ schema.sql
│  │  └─ seed.sql
│  ├─ .env.example
│  └─ package.json
├─ .env.example                 # Frontend env example
└─ README.md
```

---

## 4) Prerequis

- Node.js 18+ (`node -v`)
- npm 9+ (`npm -v`)
- MySQL 8+ (`mysql --version`)

---

## 5) Installation complete (pas a pas)

> Important: utilise 2 terminaux (backend + frontend).

### Etape A - Installer les dependances frontend

Depuis la racine du projet:

```bash
npm install
```

### Etape B - Configurer le frontend

Creer le fichier `.env` a la racine:

```env
VITE_API_BASE_URL="http://localhost:4000/api"
```

### Etape C - Installer les dependances backend

```bash
cd backend
npm install
```

### Etape D - Configurer le backend

Creer `backend/.env` (a partir de `backend/.env.example`):

```env
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_PASSWORD
DB_NAME=learnspark
JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=7d
```

### Etape E - Creer la base et les tables

Option 1 (depuis MySQL shell):

```sql
SOURCE backend/database/schema.sql;
SOURCE backend/database/seed.sql;
```

Option 2 (PowerShell):

```powershell
mysql -u root -p < backend/database/schema.sql
mysql -u root -p < backend/database/seed.sql
```

### Etape F - Lancer le backend

Dans `backend/`:

```bash
npm run dev
```

Verification:

- URL: `http://localhost:4000/health`
- Reponse attendue: `{"status":"ok"}`

### Etape G - Lancer le frontend

Dans un 2e terminal, a la racine:

```bash
npm run dev
```

Ouvrir:

- `http://localhost:5173`

---

## 6) Comptes de demo

Le role est determine automatiquement:

- `ayoub.ek@gmail.com` => `admin`
- tous les autres emails => `client`

> Les utilisateurs sont persistes en MySQL (pas en memoire volatile).

---

## 7) Scripts utiles

### Frontend (racine)
- `npm run dev` -> lance le frontend en dev
- `npm run build` -> build production
- `npm run lint` -> verification lint
- `npm run test` -> tests (si disponibles)

### Backend (`backend/`)
- `npm run dev` -> lance le backend avec nodemon
- `npm start` -> lance le backend sans nodemon

---

## 8) Endpoints API (principaux)

### Public / cours
- `GET /health`
- `GET /api/courses`
- `GET /api/courses/:courseId`
- `GET /api/courses/:courseId/lessons/:lessonId`
- `GET /api/quiz-questions`

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `PUT /api/auth/profile`

### Admin (analytics)
- `GET /api/admin/clients`
- `GET /api/admin/course-stats/top`
- `GET /api/admin/course-stats/series`
- `GET /api/admin/client-stats`
- `POST /api/admin/course-stats/reset`

### Admin (catalog CRUD)
- `GET /api/admin/courses`
- `GET /api/admin/courses/:courseId`
- `POST /api/admin/courses`
- `PUT /api/admin/courses/:courseId`
- `DELETE /api/admin/courses/:courseId`
- `GET /api/admin/courses/:courseId/lessons`
- `POST /api/admin/courses/:courseId/lessons`
- `GET /api/admin/lessons/:lessonId`
- `PUT /api/admin/lessons/:lessonId`
- `DELETE /api/admin/lessons/:lessonId`

---

## 9) Depannage rapide

### Port 4000 deja occupe
Fermer le process qui utilise le port 4000:

```powershell
Get-NetTCPConnection -LocalPort 4000 | Select-Object OwningProcess
Stop-Process -Id <PID> -Force
```

### Erreur MySQL access denied
- verifier `DB_USER` / `DB_PASSWORD` dans `backend/.env`
- verifier que MySQL est demarre

### Erreur "table users doesn't exist"
Rejouer:

```sql
SOURCE backend/database/schema.sql;
SOURCE backend/database/seed.sql;
```

### Frontend sans donnees
- verifier `VITE_API_BASE_URL`
- verifier `http://localhost:4000/health`

---

## 10) Qualite / Bonnes pratiques

- `.env` est ignore par git
- Le projet utilise MySQL uniquement (Supabase retire)
- Les images des cours sont geres avec fallback frontend
- Les stats admin de vues sont actuellement en memoire serveur (reset au restart)

---

## 11) Auteurs / Projet

Projet academique et evolutif: `LearningUpgrade`.
