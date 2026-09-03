# FLASH RTI — Build What Moves India 🇮🇳

An AI-powered citizen access portal and statutory workflow platform designed under the **Right to Information (RTI) Act, 2005**, enabling citizens to query, generate, format, and track statutory RTI petitions and access official Government of India datasets across 10 central sectors.

---

> [!CAUTION]
> ### 🚨 CRITICAL SECURITY & SECRET ROTATION NOTICE
> **Prior to production deployment**:
> Any API keys or credentials previously configured in local development environments (e.g. Google Gemini API keys, database credentials) **must be immediately rotated / regenerated** via the Google AI Studio / Google Cloud Console and database provider.
>
> If any secret was previously present on a local machine or committed in Git history on any branch, treat it as compromised and issue a new secret key immediately.

---

## 🛠️ Architecture Overview

The repository consists of two main modules:
- **`web/`**: Next.js 16 (React 19, Tailwind CSS v4, Radix UI) frontend and serverless API routes.
- **`ai/`**: FastAPI microservice powered by SentenceTransformers (`all-MiniLM-L6-v2`) and PostgreSQL pgvector for vector semantic department matching, plus ReportLab for pixel-perfect single-page RTI receipt generation.

---

## 🔐 Environment Variables & Secret Configuration

Never commit real secrets or `.env` files into version control. Templates with placeholder values are provided in `.env.example`.

### Setup Instructions

1. **Root / Next.js Web App (`web/`)**:
   ```bash
   cp web/.env.example web/.env.local
   ```
   Configure the following variables in `web/.env.local`:
   | Variable | Scope | Description |
   |---|---|---|
   | `GEMINI_API_KEY` | Server-side only | Primary Google Gemini API key |
   | `GEMINI_API_KEY_1`, `GEMINI_API_KEY_2`, `GEMINI_API_KEY_3` | Server-side only | Optional fallback keys for round-robin pooling |
   | `GOOGLE_API_KEY` | Server-side only | Fallback Google API key |
   | `DATABASE_URL` | Server-side only | PostgreSQL connection string (`postgresql://...`) |
   | `NEXT_PUBLIC_SITE_URL` | Client & Server | Canonical site URL (e.g., `https://rtionline.gov.in`) |
   | `NEXT_PUBLIC_APP_URL` | Client & Server | App base URL for internal API resolution (e.g., `http://localhost:3000`) |

2. **AI Backend (`ai/`)**:
   ```bash
   cp ai/.env.example ai/.env
   ```
   Configure the following variables in `ai/.env`:
   | Variable | Scope | Description |
   |---|---|---|
   | `DATABASE_URL` | Server-side only | PostgreSQL connection string with pgvector |
   | `FASTAPI_HOST` | Server configuration | Binding host (e.g., `0.0.0.0`) |
   | `FASTAPI_PORT` | Server configuration | Binding port (e.g., `8000`) |

---

## 🛡️ Secret Safety & Security Rules

1. **Zero Hardcoded Secrets**: All API keys, passwords, database URLs, and JWT secrets are strictly read from environment variables.
2. **Client-Side Exposure**: Only variables prefixed with `NEXT_PUBLIC_` that contain non-sensitive URLs are accessible by the browser. No API keys or tokens are ever exposed to the client.
3. **Database Credentials**: PostgreSQL connection strings reside strictly on the server side.
4. **Log Sanitization**: Console logs and error handlers redact sensitive data, personal applicant information, and API keys.

---

## 🚀 Getting Started

### 1. Web Application (Next.js)
```bash
cd web
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the platform.

### 2. AI Backend (FastAPI)
```bash
cd ai
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
