# 🏥 Med-AI — System Architecture & Workflow Specification

> **Version:** 3.0  
> **Last Updated:** April 2026  
> **System Components:** Frontend (`med-ai-v3/frontend-vite`), Core API (`med-ai-backend/backend` :8000), LLM Microservice (`LLM_Model/llm_service` :8001), Database (MongoDB Atlas), AI Inference Engine (Groq Cloud).

---

## 📋 Table of Contents

1. [High-Level System Architecture](#1-high-level-system-architecture)
2. [End-to-End User Journey](#2-end-to-end-user-journey)
3. [Authentication & Onboarding Workflow](#3-authentication--onboarding-workflow)
4. [AI Doctor Consultation Workflow](#4-ai-doctor-consultation-workflow)
   - [Guest Chat Flow (Stateless)](#41-guest-chat-flow-stateless)
   - [Authenticated Chat Flow (Context-Aware & Persistent)](#42-authenticated-chat-flow-context-aware--persistent)
5. [Medical Report Analysis Pipeline](#5-medical-report-analysis-pipeline)
   - [Document Ingestion & Text Extraction](#51-document-ingestion--text-extraction)
   - [LLM Service & Two-Pass JSON Parsing](#52-llm-service--two-pass-json-parsing)
   - [Report Data Persistence & Presentation](#53-report-data-persistence--presentation)
6. [3D Anatomy Viewer & Clinical Integration Workflow](#6-3d-anatomy-viewer--clinical-integration-workflow)
7. [Appointments & Clinical Services Workflow](#7-appointments--clinical-services-workflow)
8. [Runtime & Inter-Service Communication Flow](#8-runtime--inter-service-communication-flow)

---

## 1. High-Level System Architecture

The Med-AI platform follows a **decoupled, microservice-augmented architecture** designed for high responsiveness, secure health data handling, and fault-tolerant AI processing:

```mermaid
graph TB
    subgraph Client ["Client Layer (React 18 + Vite + TypeScript)"]
        UI["TailwindCSS + Shadcn/ui"]
        Router["React Router v6"]
        Canvas3D["3D Anatomy WebGL Engine"]
        State["Zustand / Local State"]
    end

    subgraph Gateway ["Reverse Proxy & Gateway"]
        ViteProxy["Vite Dev Proxy (:5173 /api) / Nginx"]
    end

    subgraph CoreBackend ["Core API Backend (FastAPI :8000)"]
        MainApp["FastAPI main.py"]
        AuthRouter["/api/auth (JWT / Bcrypt)"]
        ChatRouter["/api/chat (Session & History)"]
        ReportRouter["/api/reports (Ingestion & Dispatch)"]
        ProfileRouter["/api/profile & /api/documents"]
        DocParser["Parser Pipeline: PyPDF + Tesseract OCR"]
    end

    subgraph LLMService ["AI Microservice (FastAPI :8001)"]
        LLMApp["llm_service.py"]
        PromptBuilder["utils/prompt_builder.py"]
        RespParser["utils/response_parser.py (Self-Healing JSON)"]
    end

    subgraph ExternalServices ["External Cloud Services"]
        GroqChat["Groq API (llama-3.1-8b-instant)"]
        GroqReport["Groq API (llama3-70b-8192)"]
        Mongo["MongoDB Atlas (Cluster)"]
    end

    UI --> ViteProxy
    Canvas3D --> UI
    ViteProxy --> MainApp

    MainApp --> AuthRouter
    MainApp --> ChatRouter
    MainApp --> ReportRouter
    MainApp --> ProfileRouter

    AuthRouter --> Mongo
    ProfileRouter --> Mongo
    ChatRouter --> Mongo
    ChatRouter --> GroqChat

    ReportRouter --> DocParser
    ReportRouter --> LLMApp
    ReportRouter --> Mongo

    LLMApp --> PromptBuilder
    PromptBuilder --> GroqReport
    GroqReport --> RespParser
```

---

## 2. End-to-End User Journey

```mermaid
journey
    title Patient Journey Through Med-AI
    section Exploration
      Visit Landing Page: 5: Patient
      View About & Platform Safety: 4: Patient
      Try Guest AI Doctor Consultation: 4: Patient
    section Registration & Setup
      Sign Up with Email & Password: 5: Patient
      Complete Onboarding & Health Profile: 4: Patient
      Enter Dashboard: 5: Patient
    section Health Consultation
      Ask AI Doctor Health Questions: 5: Patient, AI Doctor
      Receive Triage & Clinical Guidance: 4: AI Doctor
    section Diagnostics
      Upload Medical Lab Report: 5: Patient
      Inspect OCR & AI Extracted Metrics: 5: Patient, AI Doctor
      Explore Affected Organs in 3D Anatomy: 5: Patient
    section Action & Care
      Schedule Doctor Appointment: 4: Patient
      Review Health Plan & Lab Tests: 4: Patient
```

---

## 3. Authentication & Onboarding Workflow

### Workflow Details
1. **Registration (`POST /api/auth/signup`)**:
   - Client sends user details (name, email, password).
   - Backend hashes password using `passlib` (Bcrypt) and creates user record in `users` collection in MongoDB.
   - A JWT access token is minted using `python-jose` with an expiration window and returned to the client.
2. **First-Time Onboarding (`/onboarding`)**:
   - New users are routed to the Onboarding wizard to capture baseline clinical parameters (blood group, allergies, chronic conditions, emergency contact).
   - Saved directly to user document profile via `PUT /api/profile`.
3. **Session Management (`POST /api/auth/login`)**:
   - Validates user credentials.
   - Issues fresh JWT token stored in browser `localStorage`.
   - Attached automatically in `Authorization: Bearer <token>` header for all authenticated requests.

```mermaid
sequenceDiagram
    autonumber
    actor User as Patient
    participant FE as Frontend (React)
    participant API as Core Backend (:8000)
    participant DB as MongoDB Atlas

    User->>FE: Enters signup details
    FE->>API: POST /api/auth/signup (email, password, name)
    API->>DB: Check if email exists
    DB-->>API: Not found
    API->>API: Hash password (Bcrypt)
    API->>DB: Insert new User document
    API->>API: Generate JWT token (HS256)
    API-->>FE: Return { access_token, token_type, user }
    FE->>FE: Store token in localStorage
    FE->>User: Redirect to /onboarding
    User->>FE: Fill health background (allergies, blood group)
    FE->>API: PUT /api/profile (Bearer token + profileData)
    API->>DB: Update user document
    API-->>FE: Profile updated
    FE->>User: Route to /dashboard
```

---

## 4. AI Doctor Consultation Workflow

Med-AI provides two distinct modes for medical consultation: **Guest Mode** (frictionless, privacy-centric, zero retention) and **Authenticated Mode** (contextual, historical, persistent).

### 4.1 Guest Chat Flow (Stateless)

- **Route:** `/chat` → `POST /api/chat/guest`
- **Characteristics:** Completely stateless, does not persist to database, applies strict disclaimer and educational boundaries.

```mermaid
sequenceDiagram
    autonumber
    actor Guest as Public Visitor
    participant FE as GuestChatPage
    participant API as Core Backend (:8000)
    participant Groq as Groq Cloud (llama-3.1-8b)

    Guest->>FE: Types symptom/question
    FE->>API: POST /api/chat/guest { message }
    API->>API: Load prompts/guest_chat_prompt.md
    API->>API: Inject safety disclaimers & bounds
    API->>Groq: Chat completion (model: llama-3.1-8b-instant, temp: 0.65)
    Groq-->>API: Streamed/Generated response
    API-->>FE: { reply, confidence, disclaimer }
    FE->>Guest: Displays guidance with medical advisory alert
```

---

### 4.2 Authenticated Chat Flow (Context-Aware & Persistent)

- **Route:** `/dashboard/chat` → `POST /api/chat/message`
- **Characteristics:** Tied to active session, reads recent conversation history (last 20 messages), persists conversation threads in MongoDB `chat_sessions`.

```mermaid
sequenceDiagram
    autonumber
    actor User as Authenticated Patient
    participant FE as ChatUI.tsx
    participant API as Core Backend (:8000)
    participant DB as MongoDB Atlas
    participant Groq as Groq Cloud (llama-3.1-8b)

    User->>FE: Enters follow-up health inquiry
    FE->>API: POST /api/chat/message { message } [Bearer JWT]
    API->>API: Verify JWT & extract user_id
    API->>DB: Query chat_sessions (user_id, active=true)
    alt No active session
        API->>DB: Create new chat_session document
    end
    DB-->>API: Return session with message history
    API->>API: Load prompts/chat_prompt.md
    API->>API: Format payload: System Prompt + Last 20 messages + New Query
    API->>Groq: POST /openai/v1/chat/completions (llama-3.1-8b-instant)
    Groq-->>API: Assistant response
    API->>DB: $push user & assistant messages to chat_sessions
    API->>DB: Update updated_at timestamp
    API-->>FE: { reply, session_id, timestamp }
    FE->>User: Renders message in conversation stream
```

---

## 5. Medical Report Analysis Pipeline

The Medical Report Analysis system extracts, interprets, and categorizes clinical lab reports and imaging documents into actionable diagnostic intelligence.

```mermaid
flowchart TD
    A([User Uploads File: PDF / JPG / PNG]) --> B{Format Validation & Size Check <= 10MB}
    B -- Invalid --> C[Return HTTP 400 Error]
    B -- Valid --> D[Save to Temp Storage: tempfile.NamedTemporaryFile]

    D --> E{Determine MIME / Extension}
    E -- PDF --> F[PyPDF Text Extraction utils/pdf_parser.py]
    E -- Image JPEG/PNG --> G[Tesseract OCR Engine utils/ocr_utils.py]

    F --> H[Raw Medical Text Extracted]
    G --> H

    H --> I[HTTP POST to LLM Microservice :8001/analyze]
    
    subgraph LLM_Microservice [LLM Microservice :8001]
        I --> J[Build Medical Prompt utils/prompt_builder.py]
        J --> K[Query Groq llama3-70b-8192 temp=0.3]
        K --> L[Extract Response Content]
        L --> M{Validate JSON Structure utils/response_parser.py}
        M -- Valid JSON --> P[Structured Report Payload]
        M -- Parse Error --> N[Append Self-Correction Strict Retry Prompt]
        N --> O[Retry Groq Call Pass 2]
        O --> Q{Validate Retry JSON}
        Q -- Valid --> P
        Q -- Failed --> R[Return Fallback Error Dict]
    end

    P --> S{Is User Authenticated?}
    S -- Yes --> T[Persist in MongoDB reports collection]
    S -- No --> U[Transient Analysis]
    T --> V[Return JSON Response to Frontend]
    U --> V

    V --> W[ReportResult.tsx: Visual Metric Cards, Normal/Abnormal Badges, Summary & Recommendations]
```

### 5.1 Document Ingestion & Text Extraction
- **PDF Extraction:** Handled via `pypdf`, extracting page-by-page text streams while maintaining newline separators.
- **Image Extraction (OCR):** Uses Tesseract OCR with adaptive binarization, skew correction, and noise reduction for medical paper scans.

### 5.2 LLM Service & Two-Pass JSON Parsing
To prevent hallucination and format degradation, the system uses a **two-pass self-healing pipeline**:
1. **First Pass:** Strict zero-shot prompt enforcing JSON output:
   ```json
   {
     "patient_info": { "name": "", "age": "", "date": "" },
     "tests": [
       { "name": "", "value": "", "unit": "", "reference_range": "", "status": "normal|high|low" }
     ],
     "summary": "",
     "potential_concerns": [],
     "recommendations": []
   }
   ```
2. **Second Pass (Auto-Recovery):** If markdown fences or invalid tokens occur, `get_retry_prompt()` provides explicit correction feedback to Groq for deterministic output.

### 5.3 Report Data Persistence & Presentation
- Authenticated results are stored with metadata: `user_id`, `filename`, `file_type`, `analyzed_at`, and full structured analysis.
- The frontend renders abnormal tests in high-visibility alert states with medical reference guides.

---

## 6. 3D Anatomy Viewer & Clinical Integration Workflow

Med-AI incorporates an interactive 3D anatomical model that bridges report findings and symptoms with bodily systems:

```mermaid
graph LR
    subgraph UI_Interaction ["Frontend Anatomy Explorer (/dashboard/anatomy)"]
        SysSelect["Select Organ System (Cardiovascular, Digestive, etc.)"]
        CanvasView["Interactive 3D Viewport (Orbit, Pan, Zoom)"]
        OrganClick["Click Organ Target (e.g., Heart, Liver, Lungs)"]
    end

    subgraph DataStore ["Anatomy Store (src/data/anatomyData.ts)"]
        OrganInfo["Physiological Overview & Functions"]
        CommonIssues["Common Pathologies & Symptoms"]
        RelatedTests["Associated Lab Tests (e.g., ALT, AST for Liver)"]
    end

    subgraph Platform_Actions ["Cross-Module Integration"]
        ChatLink["Ask AI Doctor About Organ Symptoms"]
        ReportFilter["Filter Uploaded Reports by Organ System"]
        BookSpecialist["Find Relevant Medical Specialist"]
    end

    SysSelect --> CanvasView
    CanvasView --> OrganClick
    OrganClick --> OrganInfo
    OrganInfo --> CommonIssues
    OrganInfo --> RelatedTests

    OrganClick --> ChatLink
    OrganClick --> ReportFilter
    OrganClick --> BookSpecialist
```

---

## 7. Appointments & Clinical Services Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Patient
    participant FE as Appointment Flow
    participant API as Core Backend (:8000)
    participant MockDB as Scheduling Engine

    Patient->>FE: Navigates to /dashboard/appointment
    FE->>Patient: Lists upcoming bookings & department directory
    Patient->>FE: Selects specialty & views doctor profile (/doctors/:id)
    FE->>Patient: Displays credentials, fees, and available slots
    Patient->>FE: Selects date, time slot, and reason for consultation
    FE->>API: POST /api/appointments/book (doctor_id, slot, notes)
    API->>MockDB: Create appointment record & hold slot
    MockDB-->>API: Confirmed booking reference
    API-->>FE: Booking success response
    FE->>Patient: Shows confirmation card & calendar sync options
```

---

## 8. Runtime & Inter-Service Communication Flow

During local development and production runtime, services collaborate over local sockets and cloud endpoints:

| Service | Port | Process Entrypoint | Role & Responsibility |
|---------|------|--------------------|-----------------------|
| **Frontend (Vite)** | `5173` | `npm run dev` | SPA host, client routing, UI state, WebGL 3D canvas |
| **Core API (FastAPI)** | `8000` | `uvicorn main:app` | Authentication, MongoDB CRUD, file upload, OCR, session router |
| **LLM Service (FastAPI)** | `8001` | `uvicorn LLM_Model.llm_service:app` | Text analysis, prompt construction, Groq LLM query & parsing |
| **MongoDB Atlas** | `27017` (Cloud) | Managed Service | Persistent store for users, profiles, chat logs, report analyses |
| **Groq Cloud API** | `443` (HTTPS) | `api.groq.com` | High-throughput inference for LLaMA models |

### Dual-Process Startup Execution
Both backend services are booted via the orchestrator script:

```bash
# From MED-AI-BACKEND/
./scripts/dev.sh
```

Which starts:
1. `uvicorn main:app --host 127.0.0.1 --port 8000 --reload`
2. `uvicorn LLM_Model.llm_service:app --host 127.0.0.1 --port 8001 --reload`

And the Vite frontend config proxies all `/api/*` calls from port `5173` seamlessly to port `8000`.
