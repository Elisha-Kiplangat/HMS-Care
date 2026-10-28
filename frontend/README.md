# HMS Web Frontend

React web app with four role-based portals: **Super Admin**, **Hospital Admin**, **Clinician** and **Patient**. The goal is a **clean, modern, minimal** interface that is easy to use on any device.

> **Status: scaffold.** Folders and empty files are in place. Implementation starts in Phase 1 (see the [root roadmap](../README.md#18-roadmap)).

## Stack

- **React** and **TypeScript**, built with **Vite**
- **Tailwind CSS** driven by design tokens
- **React Router** for routing
- **TanStack Query** for server state, **Zustand** for UI and auth state
- **React Hook Form** and **Zod** for forms and validation
- **Recharts** for charts
- Socket.IO client and the browser WebRTC API for calls
- i18n for English and Kiswahili
- Vitest, Testing Library and Playwright for tests

## Structure

```
frontend/
├── public/                      favicon, web manifest
└── src/
    ├── main.tsx  App.tsx  index.css
    ├── design-system/           tokens.css, theme.ts
    ├── components/
    │   ├── ui/                  Button, Card, Input, Modal, Table, Tabs, Toast ...
    │   ├── layout/              AppShell, Sidebar, Topbar, BottomNav, TenantSwitcher
    │   ├── charts/              GlucoseChart, Hba1cTrendChart, InRangeBar, RiskDistributionChart ...
    │   ├── telemedicine/        VideoRoom, AudioOnlyRoom, InCallVitalsPanel, CallControls ...
    │   └── domain/              GlucoseValue, RiskBadge, MedicationCard, AppointmentCard ...
    ├── portals/
    │   ├── auth/                Login, ForgotPassword, ResetPassword, AcceptInvitation
    │   ├── super-admin/         layout, routes, pages
    │   ├── hospital-admin/      layout, routes, pages
    │   ├── clinician/           layout, routes, pages
    │   └── patient/             layout, routes, pages
    ├── routes/                  router, ProtectedRoute, role redirect
    ├── services/                API client and one service per resource
    ├── store/                   authStore, uiStore, callStore
    ├── hooks/                   useAuth, useSocket, useWebRTC, useNetworkQuality ...
    ├── types/                   shared TypeScript types
    ├── utils/                   formatting, glucose units, dates
    ├── i18n/                    en.json, sw.json
    └── test/                    test setup
```

## Portals and routes

| Portal | Prefix | Pages |
|---|---|---|
| Auth | `/` | `/login`, `/forgot-password`, `/reset-password/:token`, `/accept-invitation/:token` |
| Super Admin | `/super-admin` | Dashboard, Tenants, Tenant detail, Platform admins, Audit logs, System settings |
| Hospital Admin | `/hospital-admin` | Dashboard, Clinicians, Patients, Invitations, Reports, Hospital settings |
| Clinician | `/clinician` | Triage, Patients, Patient detail, Telemedicine (`/telemedicine/:sessionId`), Schedule, Analytics, Exports |
| Patient | `/patient` | Home, Log glucose, HbA1c, Medications, Refills, Appointments, Call (`/call/:sessionId`), Profile |

After login, `roleRedirect.ts` sends each user to their portal. `ProtectedRoute.tsx` blocks any route the user's role does not allow.

## Design system

The UI follows the principles in the [root README](../README.md#13-uiux-design-principles).

- **One primary action per screen**, generous whitespace, progressive disclosure
- **Tokens first:** colours, spacing, radius and type live in `design-system/tokens.css` and are mapped into Tailwind. Components never hard-code colours
- **Palette:** teal primary (`#0F766E`) on a soft neutral background, with colour reserved for health status
- **Type:** Inter, 16px minimum body size
- **Shape:** 12px radius, 1px borders instead of heavy shadows, subtle 150 to 200ms motion
- **Light and dark themes** from the same tokens
- **Responsive:** the Patient portal is **mobile-first** with a bottom navigation bar. Clinician and admin portals use a sidebar layout for desktop and tablet

### Glucose status

Status is always shown with colour **and** icon **and** text (never colour alone), via `RiskBadge` and `GlucoseValue`.

| Status | Colour | Icon |
|---|---|---|
| Low | Red | Down arrow |
| In range | Green | Check |
| High | Amber | Up arrow |
| Very high | Red | Double up arrow |

### Accessibility

- WCAG 2.2 AA colour contrast
- Full keyboard navigation and visible focus rings
- Semantic HTML and ARIA labels, with screen-reader friendly charts (a data table alternative)
- Respect `prefers-reduced-motion` and `prefers-color-scheme`
- Touch targets of at least 44px

### Low-bandwidth friendliness

- Route-level code splitting, so each portal loads only its own code
- Skeleton loaders and optimistic updates
- Small payloads, with lists paginated
- `NetworkQualityBadge` and `PreCallCheck` guide users to audio-only calls when the connection is weak

## State and data

- **Server state:** TanStack Query via `services/*`. `apiClient.ts` attaches the token, handles refresh and normalises errors
- **Client state:** Zustand for auth, UI preferences and active call
- **Forms:** React Hook Form with Zod schemas shared with the types in `types/`
- Tokens are held in memory, with the refresh token in an httpOnly cookie. They are never stored in `localStorage`

## Internationalisation

`src/i18n/en.json` and `src/i18n/sw.json`. All user-facing text goes through the translation function. Dates, numbers and units follow the selected locale. Glucose unit (mmol/L or mg/dL) is a user setting.

## Environment variables

Copy `.env.example` to `.env`.

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend REST base URL |
| `VITE_WS_URL` | Backend WebSocket URL |
| `VITE_DEFAULT_LOCALE` | `en` or `sw` |

## Planned scripts

```bash
npm install
npm run dev          # http://localhost:5173
npm run build
npm run preview
npm run deploy       # Cloudflare Pages production deployment
npm run deploy:preview # Cloudflare Pages preview deployment
npm run lint
npm run test         # Vitest
npm run test:e2e     # Playwright
```

## Conventions

- Components are small and typed. Props are explicit
- Pages compose domain components. Pages do not fetch inside deeply nested components
- No raw colours, spacing or font sizes in components. Use tokens
- Every new screen needs an empty state, a loading state and an error state
- Every user-facing string is translatable

## Docker

`Dockerfile` builds the app and serves it with `nginx.conf` (single-page-app fallback and caching headers).
