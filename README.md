# HMS Care

HMS Care is a multi-tenant diabetes care platform for hospitals in Kenya. It connects patients, clinicians, hospital administrators, and platform administrators through web and Android experiences.

## Features

- Patient glucose logging, history, HbA1c tracking, medications, refills, and appointments
- Clinician triage, patient records, prescriptions, appointment management, refills, telemedicine, and exports
- Hospital administration, clinician and patient invitations, assignments, settings, and reports
- Super-admin hospital and platform administration
- Tenant-scoped access control and audit-ready pseudonymized exports
- Video and audio consultations with WebRTC signaling

## Stack

- Backend: NestJS, PostgreSQL, Prisma, Redis, BullMQ, Socket.IO
- Frontend: React, TypeScript, Vite, Tailwind CSS
- Mobile: Kotlin, Jetpack Compose, Room, WorkManager
- Infrastructure: Docker Compose, coturn

## Repository

```text
backend/   NestJS API and Prisma schema
frontend/  React web application
android/   Kotlin Android application
docs/      Architecture, API, security, and domain documentation
infra/     PostgreSQL and coturn configuration
```

## Local Setup

Prerequisites: Node.js LTS, Docker, Docker Compose, JDK 17+, and Android Studio for mobile development.

```bash
docker compose up -d postgres redis coturn

cd backend
npm install
npx prisma migrate deploy
npm run start:dev

cd ../frontend
npm install
npm run dev
```

The API runs at `http://localhost:3000/api/v1`. The web app runs at `http://localhost:5173`.

## Environment

Create environment files from the examples where available. The backend requires `DATABASE_URL`, Redis configuration, JWT secrets, and application configuration. The frontend supports `VITE_API_URL` and `VITE_WS_URL`.

Never commit real credentials, tokens, or service-account files.

## Validation

```bash
cd backend && npm run build
cd ../frontend && npm run build
```

## Important

HMS Care supports clinical workflows but does not replace professional medical advice or emergency care. Clinical thresholds and production compliance requirements must be reviewed and approved before deployment.
