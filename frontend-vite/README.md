# MedAI – Vite + React + TypeScript

This is the Vite-based migration of the MedAI frontend. It preserves the same UI, layout, logic, and behavior as the original Next.js app.

## Setup

```bash
npm install
npm run dev
```

- **Dev:** [http://localhost:5173](http://localhost:5173)
- **Build:** `npm run build`
- **Preview build:** `npm run preview`

## Environment variables

Use `import.meta.env.VITE_*` for client-side env vars (e.g. `VITE_API_URL`). See [Vite env docs](https://vitejs.dev/guide/env-and-mode.html).

## Project structure

- `src/pages/` – Page components (home, auth, dashboard, etc.)
- `src/components/` – Reusable UI (Navbar, Footer, Sidebar, ChatUI, ui/*)
- `src/layouts/` – Dashboard layout with sidebar and outlet
- `src/lib/` – Auth, utils, mock data, appointments
- `public/` – Static assets; add `logo.png` and `favicon.ico` for branding

## Routing

React Router v7 is used. Dashboard routes are protected; unauthenticated users are redirected to `/auth/login`.
