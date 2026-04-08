# System patterns

## Architecture

- **Frontend**: Create React App, React 18, Tailwind CSS, React Router v6 (BrowserRouter), React Hook Form + Zod on the client
- **Backend**: Express + Prisma + PostgreSQL
- **Dev networking**: CRA `proxy` to `http://localhost:3010` so same-origin `/api` calls from the browser

## API design

- `POST /api/candidates` — `multipart/form-data`: text fields plus `educationJson` and `experienceJson` (JSON arrays), optional file field `cv`
- `GET /api/suggestions/education?q=` — prefix search on distinct `EducationEntry.institution`
- `GET /api/suggestions/experience?q=` — prefix search on distinct `WorkExperienceEntry.company`

## Data model

- `Candidate` — one row per person; email unique; CV metadata stored as opaque filename + MIME + size (no absolute path exposed to clients)
- `EducationEntry` / `WorkExperienceEntry` — one-to-many from `Candidate`

## Validation

- Shared rules: Zod on server (`createCandidateBodySchema`); client uses aligned Zod schema with `zodResolver`

## File uploads

- Multer writes under `UPLOAD_DIR` (default `backend/uploads/cvs`) with UUID filenames; MIME allowlist PDF and DOCX
