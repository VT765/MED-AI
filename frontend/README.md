# MedAI – AI-Powered Health Assistant

A modern frontend for **MedAI**: AI doctor chat, medical report analysis, certified doctor bookings, emergency ambulance, and lab tests. Built with Next.js (App Router), TypeScript, Tailwind CSS, and shadcn-style UI.

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **UI:** Custom components (Button, Card, Input, etc.) + Lucide icons
- **Forms:** React Hook Form + Zod
- **Animations :** Framer Motion
- **Auth:** Mock (localStorage)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home (hero, What is MedAI, How It Works, Why MedAI, Trust, Footer) |
| `/auth/login` | Login (email/password, Google UI, Forgot password link) |
| `/auth/signup` | Signup (username, email, phone, password, terms checkbox) |
| `/dashboard` | Dashboard with module cards |
| `/dashboard/chat` | AI Doctor chat (mock responses) |
| `/dashboard/reports` | Upload & analyze medical reports (mock) |
| `/dashboard/appointment` | Book doctor (date, time, doctor selection) |
| `/dashboard/emergency` | Emergency ambulance form (mock) |
| `/dashboard/health-plan` | Coming Soon |
| `/dashboard/lab-tests` | Book lab test at home (mock) |
| `/terms`, `/privacy`, `/about`, `/contact` | Placeholder pages |

## Project Structure

```
/app          – App Router pages (home, auth, dashboard)
/components   – Navbar, Sidebar, Footer, ChatUI, UploadCard, DoctorCard, EmergencyForm, ui/*
/lib          – auth.ts (mock), mockData.ts, utils.ts
/styles       – (reserved)
```

## Mock Data

- **Auth:** User stored in `localStorage` after login/signup. No real backend.
- **Doctors, lab tests, time slots:** See `lib/mockData.ts`.
- **AI chat:** Fixed mock responses in `MOCK_AI_RESPONSES`.
- **Report analysis:** Fixed mock summary/observations/steps in `MOCK_REPORT_ANALYSIS`.

## Build & Deploy

```bash
npm run build
npm start
```

Ready for static/Node deployment (e.g. Vercel).


Test commit from Saumya
