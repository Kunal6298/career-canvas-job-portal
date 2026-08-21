# CandidArc — Full-Stack Job Portal

A production-ready job portal for job seekers and recruiters, built with React, Express, and PostgreSQL.

**Live demo:** [career-canvas-job-portal.onrender.com](https://career-canvas-job-portal.onrender.com)

## Features

- JWT authentication with recruiter and job-seeker roles
- Searchable job listings and job details
- Recruiter job posting
- Persistent resume uploads stored securely in PostgreSQL
- Recruiter hiring pipeline with application status updates
- Editable seeker profiles and skill-based job recommendations
- Recruiter listing management and application analytics
- PostgreSQL schema and demo seed data
- Responsive single-service production deployment

## Project structure

- `client/` — React + Vite frontend
- `server/` — Express REST API
- `database/` — PostgreSQL schema and seed scripts
- `screenshots/` — portfolio screenshots

## How a request moves through the project

1. A user performs an action in the React interface.
2. Axios sends an HTTP request to an Express route.
3. Authentication middleware checks the JWT and user role when required.
4. A controller validates the input and runs a parameterized SQL query.
5. PostgreSQL returns the result, which Express sends back as JSON.
6. React updates the page with the returned data.

The code intentionally uses direct SQL through `pg` instead of an ORM so the database queries and relationships remain visible for learning and interviews.

## Getting started

1. Create a PostgreSQL database named `job_portal`.
2. Run `database/schema.sql`, then optionally `database/seed.sql`.
3. Copy `server/.env.example` to `server/.env` and update the values.
4. Copy `client/.env.example` to `client/.env`.
5. Run `npm run install:all` from the project root.
6. Run `npm run dev`.

The frontend opens at `http://localhost:5173` and the API at `http://localhost:5000`.

## Demo accounts

After running the seed script (or deploying with `SEED_DEMO_DATA=true`):

- Recruiter: `recruiter@example.com`
- Job seeker: `seeker@example.com`
- Password for both: `Password123!`

## Production deployment

The repository includes `render.yaml` for a single Render web service. The server automatically applies the database schema on startup and serves the compiled React application in production. Set `DATABASE_URL` to a PostgreSQL connection string; secrets are never committed.

## API routes

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/jobs`
- `GET /api/jobs/:id`
- `GET /api/jobs/recommended` (job seeker)
- `GET /api/jobs/mine` (recruiter)
- `POST /api/jobs` (recruiter)
- `PATCH /api/jobs/:id` (recruiter)
- `POST /api/applications` (job seeker)
- `GET /api/applications/me`
- `GET /api/applications/recruiter` (recruiter)
- `PATCH /api/applications/:id/status` (recruiter)
- `GET /api/applications/:id/resume` (authorized user)
- `GET /api/users/me`
- `PATCH /api/users/me`
