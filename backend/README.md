# Backend (FastAPI + PostgreSQL + bcrypt + email verify + JWT)

## 1) Setup
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Заповни `.env` (DATABASE_URL, JWT_SECRET, Gmail дані).

## 2) Run
```bash
uvicorn app.main:app --reload
```

## 3) Endpoints
- POST /auth/register
- GET  /auth/verify-email?token=...
- POST /auth/login
- GET  /auth/me

## Gmail підтвердження
Рекомендовано: увімкни 2FA в Google акаунті → створи App Password для Mail.
У `.env` встав `GMAIL_USER` і `GMAIL_APP_PASSWORD`.

## Примітка
Таблиці `users` і `email_verification_tokens` мають вже існувати в БД `online_ads_db`.
