# Progress

## Working

- PostgreSQL via Docker Compose; Prisma migrations for `Candidate`, `EducationEntry`, `WorkExperienceEntry`
- Express routes: health/root message, `POST /api/candidates`, suggestion GET endpoints
- CORS, `express.json` for JSON routes, Multer for multipart
- Frontend dashboard CTA and add-candidate form with validation, success/error UI, optional CV, datalist-style suggestions
- README and `backend/.env.example` for configuration
- Memory bank initialized

## Known issues / follow-ups

- CRA + Jest works with `react-router-dom` v6; upgrading to React Router v7 may require Jest/Vitest config changes
- Multer 1.x deprecation warning — consider upgrading to multer 2.x when compatible with stack
- Backend `GET /` test and integration tests require a running PostgreSQL for `POST` success path

## Not implemented

- User accounts and authorization
- Listing or editing candidates in the UI
