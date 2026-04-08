# Tech context

## Stack

| Layer | Technology |
|-------|------------|
| UI | React 18, Tailwind 3, CRA |
| Routing | React Router 6 |
| Forms | react-hook-form, @hookform/resolvers, Zod |
| API | Express 4 |
| ORM | Prisma 5 |
| DB | PostgreSQL (Docker Compose in repo) |

## Environment

- Backend: `DATABASE_URL`, `CORS_ORIGIN`, `UPLOAD_DIR`, `PORT` (see `backend/.env.example`)
- Database: credentials from `docker-compose.yml` (`LTIdbUser`, `LTIdb`, etc.)

## Commands

- Backend: `cd backend && npm run dev` (port 3010)
- Frontend: `cd frontend && npm start` (port 3000)
- DB: `docker-compose up -d` from repo root

## Testing

- Backend: Jest + Supertest (`NODE_ENV=test` avoids binding `listen`)
- Frontend: Jest + RTL (MemoryRouter for routed components)
