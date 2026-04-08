# Active context

## Current focus

Implemented **add candidate** flow: recruiter dashboard (`/`), add candidate form (`/candidates/new`), REST API with multipart uploads, Prisma models, suggestion endpoints, and project documentation (README + memory bank).

## Decisions

- **No auth** in this delivery; API is open behind CORS — document production risk
- **React Router 6** (not v7 framework mode) due to CRA + Jest compatibility
- **CV optional**; server-side MIME allowlist and size limit (10 MB)

## Next steps (suggested)

- Add recruiter authentication and session or JWT
- Add secure CV download route (signed URLs or authorized streaming)
- Rate limiting and antivirus scanning on uploads for production
