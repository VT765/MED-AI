# 🏥 Med-AI — Project Folder Structure

> **Last Updated:** April 2026  
> Two separate repositories work together to power the Med-AI platform:  
> - **Frontend** → `med-ai-v3/frontend-vite` (React + Vite + TypeScript + TailwindCSS)  
> - **Backend** → `med-ai-backend/backend` (Python + FastAPI + SQLAlchemy)

---

## 📁 Repository Overview

```
med-ai-v3/                          ← Frontend mono-repo root
├── frontend-vite/                  ← Main Vite app
├── Documentation/                  ← Project docs folder
├── package.json
└── README.md

med-ai-backend/                     ← Backend repo root
├── backend/                        ← FastAPI application
└── lbmaske/                        ← (miscellaneous/legacy)
```

---

## 🖥️ Frontend — `med-ai-v3/frontend-vite/`

### Root Config Files

| File | Purpose |
|------|---------|
| `index.html` | App entry HTML shell |
| `vite.config.ts` | Vite build config |
| `tailwind.config.js` | TailwindCSS theme & config |
| `postcss.config.js` | PostCSS plugins |
| `tsconfig.json` | TypeScript compiler config |
| `tsconfig.node.json` | TS config for Node (Vite) |
| `package.json` | NPM dependencies & scripts |
| `.env` | Environment variables (API base URL, etc.) |

---

### `src/` — Application Source

```
src/
├── main.tsx                        ← App bootstrap / ReactDOM.render
├── App.tsx                         ← Root component, global router
├── index.css                       ← Global base styles
├── vite-env.d.ts                   ← Vite type declarations
│
├── pages/                          ← Route-level page components
│   ├── HomePage.tsx                ← Public landing page
│   ├── AboutPage.tsx               ← About the platform
│   ├── ContactPage.tsx             ← Contact / support form
│   ├── PrivacyPage.tsx             ← Privacy policy
│   ├── TermsPage.tsx               ← Terms of service
│   │
│   ├── auth/                       ← Authentication pages
│   │   ├── LoginPage.tsx           ← User login
│   │   └── SignupPage.tsx          ← User registration
│   │
│   └── dashboard/                  ← Protected dashboard pages
│       ├── DashboardPage.tsx       ← Main dashboard / overview
│       ├── ChatPage.tsx            ← AI Doctor chat interface
│       ├── ReportsPage.tsx         ← Medical report upload & analysis
│       ├── ProfilePage.tsx         ← User profile management
│       ├── AppointmentPage.tsx     ← Appointments listing
│       ├── AppointmentBookPage.tsx ← Book a new appointment
│       ├── AppointmentDoctorPage.tsx ← Doctor selection for appointment
│       ├── LabTestsPage.tsx        ← Lab tests section
│       ├── HealthPlanPage.tsx      ← Personalized health plans
│       ├── EmergencyPage.tsx       ← Emergency services
│       ├── HelpPage.tsx            ← Help & support
│       └── SettingsPage.tsx        ← Account settings
│
├── components/                     ← Reusable UI components
│   ├── Navbar.tsx                  ← Top navigation bar
│   ├── Sidebar.tsx                 ← Dashboard sidebar navigation
│   ├── Footer.tsx                  ← Site-wide footer
│   ├── Logo.tsx                    ← Brand logo component
│   ├── ChatUI.tsx                  ← Full AI chat interface widget
│   ├── UploadCard.tsx              ← Medical document upload card
│   ├── ReportResult.tsx            ← AI-analyzed report display
│   ├── EmergencyForm.tsx           ← Emergency request form
│   ├── DoctorCard.tsx              ← Doctor info card (compact)
│   ├── DoctorListCard.tsx          ← Doctor info card (list view)
│   │
│   └── ui/                         ← Base shadcn/ui primitives
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── textarea.tsx
│       └── tooltip.tsx
│
├── layouts/                        ← Page layout wrappers
│   └── DashboardLayout.tsx         ← Sidebar + topbar shell for dashboard
│
├── lib/                            ← API clients & utility modules
│   ├── api.ts                      ← Axios/fetch base client setup
│   ├── auth.ts                     ← Auth helpers (login, logout, token)
│   ├── appointments.ts             ← Appointment API calls
│   ├── mockData.ts                 ← Static mock data for dev/testing
│   └── utils.ts                    ← General helper functions
│
└── types/                          ← TypeScript type definitions
    └── report.ts                   ← Report-related interfaces/types
```

---

## ⚙️ Backend — `med-ai-backend/backend/`

### Root Files

| File | Purpose |
|------|---------|
| `main.py` | FastAPI app init, CORS, router registration |
| `config.py` | App settings loaded from `.env` |
| `database.py` | SQLAlchemy engine & session setup |
| `deps.py` | FastAPI dependency injection (DB session, current user) |
| `requirements.txt` | Python package dependencies |
| `.env` | Environment variables (DB URL, API keys, JWT secret) |

---

### `backend/` — Application Source

```
backend/
├── main.py                         ← FastAPI app entrypoint
├── config.py                       ← Settings / env config
├── database.py                     ← DB engine & session factory
├── deps.py                         ← Shared FastAPI dependencies
├── requirements.txt                ← Python dependencies
│
├── routers/                        ← API route handlers (controllers)
│   ├── __init__.py
│   ├── auth.py                     ← /auth — Register, login, JWT tokens
│   ├── chat.py                     ← /chat — AI doctor conversation endpoint
│   ├── documents.py                ← /documents — Upload & retrieve medical docs
│   └── report.py                   ← /report — AI-powered report analysis
│
├── models/                         ← SQLAlchemy ORM table definitions
│   ├── __init__.py
│   ├── user.py                     ← User table model
│   └── document.py                 ← Document/report table model
│
├── schemas/                        ← Pydantic request/response schemas
│   ├── __init__.py
│   ├── auth.py                     ← Login, register, token schemas
│   ├── chat.py                     ← Chat message schemas
│   └── document.py                 ← Document upload/response schemas
│
├── utils/                          ← Utility / helper modules
│   ├── __init__.py
│   ├── security.py                 ← Password hashing, JWT creation/verify
│   ├── ocr_utils.py                ← OCR pre-processing helpers
│   ├── pdf_parser.py               ← PDF text extraction
│   ├── prompt_builder.py           ← LLM prompt construction
│   └── response_parser.py          ← Parse & structure LLM output
│
├── LLM_Model/                      ← AI model integration layer
│   ├── llm_service.py              ← LLM calls (Gemini / OpenAI wrapper)
│   └── ocr_client.py               ← OCR API client
│
├── prompts/                        ← System prompt templates
│   └── script.md                   ← AI doctor system prompt / instructions
│
├── migrations/                     ← Alembic DB migration scripts
│   ├── __init__.py
│   └── rename_user_name_to_username.py
│
└── uploads/                        ← Stored uploaded medical files (runtime)
```

---

## 🔗 Key Connections (Frontend ↔ Backend)

| Frontend Module | Backend Endpoint | Purpose |
|----------------|-----------------|---------|
| `lib/auth.ts` | `routers/auth.py` | Login, signup, JWT token exchange |
| `ChatUI.tsx` | `routers/chat.py` | Streaming AI doctor conversation |
| `UploadCard.tsx` | `routers/documents.py` | Upload medical documents |
| `ReportResult.tsx` | `routers/report.py` | AI medical report analysis results |
| `AppointmentPage.tsx` | *(mock data for now)* | Appointment management |
| `LabTestsPage.tsx` | *(mock data for now)* | Lab test records |

---

## 🛠️ Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18 + Vite |
| Language (FE) | TypeScript |
| Styling | TailwindCSS + shadcn/ui |
| Backend Framework | FastAPI (Python) |
| ORM | SQLAlchemy |
| DB Migrations | Alembic |
| Auth | JWT (python-jose) |
| AI / LLM | Google Gemini API |
| OCR | External OCR API client |
| Document Parsing | Custom PDF parser + OCR utils |
