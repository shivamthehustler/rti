# FLASH RTI — Web Client & API Backend

Next.js web application for FLASH RTI, providing citizen dashboards, Flash RTI instantaneous query workflows, statutory PDF receipt downloads, and Government of India open data presentation.

---

> [!WARNING]
> ### 🚨 Security & Secret Rotation Notice
> Always rotate any API keys and database credentials before production deployment. Ensure `.env` or `.env.local` files are never tracked in Git.

---

## ⚙️ Environment Configuration

Copy `.env.example` to create your local `.env.local`:

```bash
cp .env.example .env.local
```

### Required Variables

| Variable | Target Scope | Description |
|---|---|---|
| `GEMINI_API_KEY` | Server-Side Only | Primary Google Gemini API key for RTI drafting and LLM workflows. |
| `GEMINI_API_KEY_1`..`3` | Server-Side Only | Optional fallback keys for round-robin rotation. |
| `GOOGLE_API_KEY` | Server-Side Only | Optional fallback Google API key. |
| `DATABASE_URL` | Server-Side Only | Optional PostgreSQL connection string for persistent history and request logging. |
| `NEXT_PUBLIC_SITE_URL` | Browser & Server | Public site domain URL (e.g. `https://rtionline.gov.in`). |
| `NEXT_PUBLIC_APP_URL` | Browser & Server | Public app URL (e.g. `http://localhost:3000`). |

---

## 🚀 Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📦 Production Build

```bash
npm run build
npm run start
```
