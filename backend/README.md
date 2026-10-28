# HMS Backend

NestJS API for the HMS diabetes glycemic control platform. It serves the web portals and the Android app, enforces multi-tenant isolation, runs background jobs and relays WebRTC signalling.

## Stack

- Node.js and TypeScript, **NestJS** (modular monolith)
- **PostgreSQL** in **Neon** with **Prisma** ORM and row-level security
- **Redis** with **BullMQ** for queues and scheduled jobs
- **Socket.IO** for call signalling and presence
- class-validator and class-transformer for DTO validation
- Swagger/OpenAPI served at `/api/docs`
- Jest and Supertest for tests

## Structure

```
backend/
├── prisma/
│   ├── schema.prisma            data model
│   ├── seed.ts                  Super Admin and demo hospital
│   └── migrations/
├── src/
│   ├── main.ts                  bootstrap
│   ├── app.module.ts
│   ├── config/                  configuration and env validation
│   ├── prisma/                  PrismaModule and PrismaService
│   ├── common/
│   │   ├── decorators/          @Roles, @CurrentUser, @CurrentTenant, @Public
│   │   ├── guards/              JwtAuthGuard, RolesGuard, TenantGuard
│   │   ├── interceptors/        audit logging
│   │   ├── filters/             HTTP exception filter
│   │   ├── tenancy/             tenant context, middleware
│   │   └── utils/               pagination, glucose units, CSV, pseudonymisation
│   ├── modules/                 domain modules (auth, tenants, glucose, triage, etc.)
│   ├── queues/                  BullMQ processors
│   └── realtime/                Socket.IO gateways
└── test/                        e2e tests, including tenant isolation
```

## Environment Variables

Copy `.env.example` to `.env`. Required variables:

| Variable | Description / Example |
|---|---|
| `NODE_ENV` | `production` or `development` |
| `PORT` | Dynamic web port assigned by Render (default: `3000`) |
| `DATABASE_URL` | Neon PostgreSQL connection string with `?sslmode=require` |
| `REDIS_URL` | Redis connection string (e.g. Upstash or Render Redis) |
| `JWT_ACCESS_SECRET` | Secret key for signing access JWTs |
| `JWT_ACCESS_TTL` | Access token TTL (e.g., `15m`) |
| `JWT_REFRESH_SECRET` | Secret key for signing refresh JWTs |
| `JWT_REFRESH_TTL` | Refresh token TTL (e.g., `7d`) |
| `CORS_ORIGINS` | Comma-separated list of allowed frontend origins |
| `FCM_*` | Firebase Cloud Messaging credentials |
| `AT_*` | Africa's Talking SMS API credentials |
| `SMTP_*` | Email provider SMTP credentials |
| `TURN_*` | STUN/TURN WebRTC server credentials |

---

## Deploying to Render with Neon PostgreSQL

### 1. Provision PostgreSQL on Neon
1. Create a database on [Neon.tech](https://neon.tech).
2. Copy the connection string provided in the Neon console. Ensure it includes `?sslmode=require`:
   ```
   postgresql://<user>:<password>@<neon-hostname>.neon.tech/<dbname>?sslmode=require
   ```

### 2. Configure Web Service on Render
1. Log in to [Render](https://render.com) and click **New +** -> **Web Service**.
2. Connect your repository and select the repository root or specify the root directory as `backend`.
3. Set the configuration details as follows:
   - **Name:** `hms-backend`
   - **Environment:** `Node`
   - **Root Directory:** `backend`
   - **Build Command:**
     ```bash
     npm install && npm run build && npx prisma generate
     ```
   - **Start Command:**
     ```bash
     npx prisma migrate deploy && npm run prisma:seed && node dist/src/main.js
     ```

### 3. Set Environment Variables on Render
Under the **Environment** tab of your Render Web Service, add the following variables:
- `NODE_ENV`: `production`
- `DATABASE_URL`: `postgresql://<user>:<password>@<neon-hostname>.neon.tech/<dbname>?sslmode=require`
- `REDIS_URL`: `redis://:<password>@<redis-hostname>:<port>` (optional if using Redis for BullMQ)
- `JWT_ACCESS_SECRET`: `<your-random-32-char-secret>`
- `JWT_REFRESH_SECRET`: `<your-random-32-char-secret>`
- `CORS_ORIGINS`: `https://your-frontend-app.onrender.com`

---

## Local Development & Testing

```bash
cd backend
npm install
cp .env.example .env

# Generate Prisma client and apply migrations to Neon
npx prisma generate
npx prisma migrate dev

# Seed default Super Admin & demo hospital
npm run prisma:seed

# Start development server
npm run start:dev

# Run tests
npm run test
npm run build
```

API Documentation will be served at `http://localhost:3000/api/docs`.

For local development without Docker, set `DATABASE_URL` in `backend/.env` to the
connection string copied from Neon. It must include `?sslmode=require`. `REDIS_URL`
is optional; leave it empty when background queues are not needed.
