# 🐇 RabbitAI — Sales Report Generator

AI-powered sales data analysis and email delivery platform. Upload a `.csv` or `.xlsx` file with sales data, and an LLM generates a professional narrative summary that gets emailed to any recipient.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v20+)
- A **Groq** or **Google Gemini** API key (free tiers available)
- SMTP credentials for sending emails (Gmail App Password, Brevo, Resend, etc.)

---

### 1. Clone the Repository

```bash
git clone https://github.com/kunalbhatia2601/RabbitAI.git
cd RabbitAI
```

### 2. Setup the Backend

```bash
cd server
cp .env.example .env
```

Open `server/.env` and fill in your credentials (see [Environment Variables](#-environment-variables) below).

```bash
npm install
npm run dev
```

The backend will start at **http://localhost:4000**.
Swagger API docs are available at **http://localhost:4000/api-docs**.

### 3. Setup the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at **http://localhost:5173**.

---

## 🔐 Environment Variables

Create a `server/.env` file (copy from `server/.env.example`) and configure:

### Server

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `4000` | Port the backend server runs on |

### AI Provider

| Variable | Required | Default | Description |
|---|---|---|---|
| `AI_PROVIDER` | No | `groq` | Which AI to use: `groq` or `gemini` |
| `GROQ_API_KEY` | Yes (if groq) | — | Get it free from [console.groq.com](https://console.groq.com) |
| `GROQ_MODEL` | No | `llama-3.3-70b-versatile` | Groq model to use |
| `GEMINI_API_KEY` | Yes (if gemini) | — | Get it from [aistudio.google.com](https://aistudio.google.com/apikey) |
| `GEMINI_MODEL` | No | `gemini-2.0-flash` | Gemini model to use |

### Email (SMTP)

| Variable | Required | Default | Description |
|---|---|---|---|
| `SMTP_HOST` | Yes | `smtp.gmail.com` | SMTP server hostname |
| `SMTP_PORT` | Yes | `587` | SMTP port |
| `SMTP_USER` | Yes | — | SMTP username / email address |
| `SMTP_PASS` | Yes | — | SMTP password or app-specific password |
| `SMTP_FROM` | No | Same as `SMTP_USER` | "From" address on sent emails |

> **Gmail Users:** Enable 2FA on your Google account, then generate an [App Password](https://myaccount.google.com/apppasswords) to use as `SMTP_PASS`.

---

## 🐳 Docker

Run the entire stack in containers:

```bash
# 1. Configure environment
cp server/.env.example server/.env
# Edit server/.env with your credentials

# 2. Build and run
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:4000 |
| Swagger Docs | http://localhost:4000/api-docs |

---

## 📡 API Reference

Interactive Swagger UI is available at `/api-docs` when the server is running.

### `POST /api/upload`

Upload a sales data file and receive an AI-generated report via email.

**Request:** `multipart/form-data`
| Field | Type | Description |
|---|---|---|
| `file` | File | `.csv` or `.xlsx` file (max 10 MB) |
| `email` | String | Recipient email address |

**Response (200):**
```json
{
  "success": true,
  "message": "Report generated and sent to user@example.com",
  "report": "<h2>Executive Summary</h2>..."
}
```

### `GET /api/health`

Returns server health status.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| AI Engine | Groq (Llama 3.3) / Google Gemini |
| Email | Nodemailer (SMTP) |
| API Docs | Swagger / OpenAPI 3.0 |
| Security | Helmet, CORS, Rate Limiting |
| Containers | Docker + docker-compose |
| CI/CD | GitHub Actions |