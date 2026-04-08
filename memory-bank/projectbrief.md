# Project brief — LTI Talent Tracking System

## Purpose

Full-stack ATS-style application for recruiters to manage candidates: contact data, education, work experience, and optional CV uploads (PDF/DOCX).

## Scope (current)

- Recruiter dashboard with a clear call-to-action to add candidates
- Candidate creation API backed by PostgreSQL and Prisma
- Suggestion endpoints for education institutions and companies (from existing records)
- No recruiter authentication in this iteration (development scope; production must add auth and hardening)

## Out of scope (for now)

- Login, roles, and audit per user
- CV download/preview endpoints for recruiters
- Email notifications
