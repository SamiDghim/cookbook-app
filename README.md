# React Recipes

Local development and tests for the React + Vite recipes app.

## Quick start

1. Install dependencies:

```bash
npm install
# also install api deps
cd api && npm install
cd ..
```

2. Seed the database (creates `data/sqlite.db`):

```bash
node api/init-db.js
```

3. Run services:

- To run both frontend and API with Docker Compose (recommended for parity):

```bash
docker-compose up --build
```

- To run locally without Docker:

```bash
# start API
node api/server.js
# in another terminal
npm run dev
```

Frontend will be available at `http://localhost:5173` and API at `http://localhost:4000`.

## Tests

### Unit tests (Vitest + Testing Library)

```bash
npm install
npm test
```

> If Vitest fails due to Node version compatibility, use Node >= 18.

### E2E tests (Playwright)

Playwright will start the frontend server automatically (see `playwright.config.ts`).

```bash
npx playwright test
```

## Notes

- The API implements soft-delete; deleted recipes get a `deletedAt` timestamp and are excluded from normal listing. There's an endpoint `POST /api/recipes/:id/restore` to restore.
 - The API implements soft-delete; deleted recipes get a `deletedAt` timestamp and are excluded from normal listing. There's an endpoint `POST /api/recipes/:id/restore` to restore. You can list deleted items by calling `GET /api/recipes?includeDeleted=true`.
- The demo auth is simple (plaintext passwords in the DB). Replace with `bcrypt` + JWT for production.

If you want, I can:
- Add an admin route to list deleted recipes (`?includeDeleted=true`).
- Harden authentication (bcrypt + JWT).
- Run the test suite in a pinned Node Docker container if you can't run tests locally.

