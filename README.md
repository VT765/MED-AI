# 🏥 MedAI — AI-Powered Medical Assistant Platform

MedAI is an **AI-driven healthcare assistance platform** designed to help users **analyze medical reports, consult an AI doctor through conversation, manage health-related services, and make informed medical decisions** — all from a single, unified interface.

The project combines **Artificial Intelligence, modern web technologies, and healthcare-focused UX** to deliver a **secure, scalable, and user-friendly digital health solution**.

---

## 🚀 Project Motivation

Access to timely and reliable medical guidance is often limited due to:
- Shortage of medical professionals
- High consultation costs
- Delayed diagnosis
- Difficulty in understanding complex medical reports

MedAI aims to **bridge the gap between patients and medical intelligence** by providing:
- Instant AI-based medical guidance
- Simplified medical report analysis
- A centralized digital healthcare assistant

---

## 🎯 Project Objectives

- Provide an **AI Doctor** for preliminary medical consultation
- Analyze **medical reports** and explain them in simple language
- Offer a **secure and user-friendly dashboard** for health management
- Improve healthcare accessibility using AI
- Maintain medical-grade UX, accessibility, and data security

---

## 🧠 Key Features

### 🤖 AI Doctor (Core Feature)
- Conversational AI-based medical assistant
- Question–Answer driven consultation
- Symptom analysis and guidance
- Clear, structured, and understandable responses
- Designed for **preliminary guidance**, not final diagnosis

---

### 📄 Medical Report Analysis
- Upload medical reports (PDF / images)
- AI-powered extraction and interpretation
- Simplified explanations of medical terms
- Highlighting abnormal values and potential concerns

---

### 📊 User Dashboard
- Centralized health overview
- Easy navigation of medical features
- Clean and decluttered UI
- Responsive across all devices

---

### 🧪 Lab Tests & Appointments (Planned)
- Book lab tests
- Doctor appointment scheduling
- Emergency service access
- Health plan recommendations

---

## 🏗️ System Architecture & Workflow

Med-AI uses a decoupled, dual-backend microservice architecture:
- **Frontend Layer:** React 18 + Vite + TypeScript + TailwindCSS + Three.js 3D Anatomy Engine
- **Core API Backend:** FastAPI (`localhost:8000`) handling Authentication, Profile, Chat sessions, and Document Ingestion
- **AI / LLM Microservice:** FastAPI (`localhost:8001`) with Groq Cloud integration (`llama3-70b-8192` & `llama-3.1-8b-instant`)
- **Data Layer:** MongoDB Atlas for user profiles, persistent chat histories, and analyzed lab reports
- **Parsing Pipeline:** PyPDF for digital documents + Tesseract OCR engine for scanned images

📖 **Complete documentation:** See the full workflow, sequence diagrams, and architecture breakdown in [WORKFLOW.md](Documentation/WORKFLOW.md) and folder structure in [PROJECT_STRUCTURE.md](Documentation/PROJECT_STRUCTURE.md).

---

## 🔹 Key Features (Project)

- **AI-Based Medical Assistant:** Provides basic prescription and health guidance through an interactive question–answer system.
- **Medical Report Analysis:** Allows users to upload medical report images or PDFs and explains key health parameters in simple language.
- **User-Friendly Interface:** Simple, clean, and responsive web interface accessible on desktop and mobile devices.
- **Educational Guidance Only:** Ensures all medical suggestions are strictly for awareness and educational purposes.
- **Safety Alerts & Recommendations:** Advises users to consult certified medical professionals for serious or critical conditions.
- **24/7 Availability:** AI assistant is available anytime, improving accessibility to health information.

---

## 🔹 TERMS & CONDITIONS (Very important for healthcare projects)

1. MedAI is designed only for educational and informational purposes.
2. The system does not replace professional medical advice, diagnosis, or treatment.
3. Users must consult a certified doctor before following any medical recommendations.
4. MedAI is not responsible for any health outcomes resulting from misuse of information.
5. Uploaded medical reports are used only for analysis and are not shared with third parties.
6. Users must provide accurate and truthful information for better guidance.
7. Any misuse of the system may result in restricted access.

By using MedAI, the user agrees to these terms.

---

## 🔹 HELP & SUPPORT

- **User Guidance:** Step-by-step assistance on how to ask health-related questions and upload medical reports.
- **FAQ Section:** Answers common questions related to prescriptions, reports, and system usage.
- **Error Handling Support:** Clear messages are shown if reports are unreadable or inputs are unclear.
- **Contact Support:** Users can reach the support team via email or contact form for technical issues.
- **Feedback & Improvement:** Users can submit feedback to improve system accuracy and usability.

If you'd like, I can also add a short FAQ file or a `SUPPORT.md` page with contact templates and sample questions.

