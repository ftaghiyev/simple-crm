# Simple CRM

A lightweight CRM for managing leads and activities with a clean React + FastAPI stack.

## Description

Simple CRM lets you register, log in, add and track leads, record activities, and view analytics. The backend is FastAPI with JWT auth and SQLAlchemy. The frontend is React + TypeScript with shadcn/ui, React Query, and React Hook Form.

## Getting Started

### Dependencies

- Python 3.11+
- Node.js 18+ and npm
- PostgreSQL 13+ (or update `DATABASE_URL` to your DB)
- macOS/Linux/WSL or Windows 10+

### Installing

**1) Clone**

```
git clone https://github.com/ftaghiyev/simple-crm.git
cd simple-crm
```

**2) Backend**

```
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Edit `.env`:

```
DATABASE_URL=YOUR_DATABASE_URL
SECRET_KEY=change_me
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

**3) Frontend**

```
cd ../frontend/crm-ui
npm install
cp .env.example .env
```

Edit `.env`:

```
VITE_API_BASE_URL=http://localhost:8000
```

### Executing program

**Run backend**

```
cd backend
source venv/bin/activate        # Windows: venv\Scripts\activate
uvicorn src.main:app --reload
```

**Run frontend**

```
cd frontend/crm-ui
npm run dev
```

Open: `http://localhost:5173`

## Authors

Farid Taghiyev

---

## Tech Stack

**Backend**

- FastAPI, SQLAlchemy, Pydantic
- JWT auth, passlib/bcrypt
- PostgreSQL

**Frontend**

- React + TypeScript + Vite
- shadcn/ui (Radix + Tailwind)
- React Query, Axios
- React Hook Form + Zod
- date-fns

---

## Folder Structure

```
backend/                    # FastAPI
└─ src/
   ├─ database.py           # DB engine/session
   ├─ main.py               # App entry and CORS
   ├─ models.py             # SQLAlchemy models
   ├─ routers/              # API routes
   │  ├─ users.py
   │  ├─ leads.py
   │  ├─ activities.py
   │  └─ dashboard.py
   ├─ schemas.py            # Pydantic models
   └─ security.py           # JWT, hashing

frontend/crm-ui/            # React app
└─ src/
   ├─ api/                  # API clients
   ├─ components/           # UI and feature components
   ├─ context/              # Auth context
   ├─ hooks/                # hooks like auth, leads, analytics, activities, etc
   ├─ layouts/              # Dashboard, Auth
   ├─ pages/                # Home, Analytics, Lead Management
   ├─ routes/               # public/root/protected
   ├─ types/                # TS types
   └─ axios-client/         # axios instance
```

---

## Environment Samples

**backend/.env.example**

```
DATABASE_URL=postgresql://user:password@localhost:5432/simple_crm
SECRET_KEY=change_me
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

**frontend/crm-ui/.env.example**

```
VITE_API_BASE_URL=http://localhost:8000
```
