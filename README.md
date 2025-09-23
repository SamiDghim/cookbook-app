

![CI](https://github.com/SamiDghim/cookbook-app/actions/workflows/ci.yml/badge.svg)

# Cookbook App

Full-stack recipe manager built with React (Vite), Express, and SQLite. Includes local and Docker-based development, unit and E2E tests, and a simple authentication system.

---

## Features

- Modern React frontend (Vite, TypeScript, Tailwind)
- Express API with SQLite (file-based, no server needed)
- Soft-delete for recipes (restore deleted items)
- Simple authentication (username/password, demo only)
- Unit tests (Vitest, Testing Library)
- E2E tests (Playwright)

---

## Getting Started

### 1. Install dependencies

```bash
npm install
cd api && npm install && cd ..
```

### 2. Seed the database

Creates `data/sqlite.db` with sample recipes and a default user (`admin`/`password`).

```bash
node api/init-db.js
```

### 3. Run the app

#### Option A: Docker Compose (recommended)

Runs both frontend and API in containers. Hot reload enabled for local code changes.

```bash
docker-compose up --build
```

#### Option B: Local (no Docker)

Start API:

```bash
node api/server.js
```

Start frontend (in another terminal):

```bash
npm run dev
```

Frontend: [http://localhost:5173](http://localhost:5173)
API: [http://localhost:4000](http://localhost:4000)

---

## Scripts

- `npm run dev` – Start frontend in dev mode
- `npm run build` – Build frontend for production
- `npm run lint` – Lint code with ESLint
- `npm run test` – Run unit tests (Vitest)
- `npm run e2e` – Run E2E tests (Playwright)
- `npm run format` – Format code with Prettier

---

## Testing

### Unit tests (Vitest + Testing Library)

```bash
npm test
```

### E2E tests (Playwright)

Playwright will start the frontend server automatically (see `playwright.config.ts`).

```bash
npx playwright test
```

---

## API Overview

- `GET /api/recipes` – List recipes
- `GET /api/recipes/:id` – Get recipe by ID
- `POST /api/recipes` – Create recipe
- `PUT /api/recipes/:id` – Update recipe
- `DELETE /api/recipes/:id` – Soft-delete recipe
- `POST /api/recipes/:id/restore` – Restore soft-deleted recipe
- `GET /api/recipes?includeDeleted=true` – List all (including deleted)
- `POST /api/signup` – Create user
- `POST /api/login` – Login (returns token)
- `GET /api/profile` – Get user profile (token required)

---

## Authentication

- Demo only: passwords are stored in plaintext. **Do not use in production!**
- To login: use `admin` / `password` (default user)
- Auth endpoints: `/api/signup`, `/api/login`, `/api/profile`

---

## Docker

- `docker-compose up --build` – Start both frontend and API
- `Dockerfile` – Production build (serves static files with Nginx)
- `Dockerfile.dev` – Dev build (hot reload, Vite dev server)
- `api/Dockerfile` – API container

---

## Troubleshooting

- If you see database errors, try re-running `node api/init-db.js`.
- If Playwright E2E tests fail, ensure no other process is using port 5173.
- For Node version issues, use Node >= 18 (recommended: Node 20).

---

## Contributing

PRs and issues welcome! See TODOs in code and open issues for ideas.

---

## License

MIT

