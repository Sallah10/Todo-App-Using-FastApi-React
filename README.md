# Todo App

A full-stack todo application with a React frontend and a FastAPI backend. The API stores todo items in SQLite for local development and can use Neon PostgreSQL in production.

## Technology

- Frontend: React and Vite
- Backend: FastAPI and SQLAlchemy
- Local database: SQLite
- Production database: Neon PostgreSQL

## Run locally

Start the backend in one terminal:

```powershell
cd backend
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

Start the frontend in another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open <http://127.0.0.1:5173>. The API documentation is at <http://127.0.0.1:8000/docs>.

## Documentation

See [DEPLOYMENT.md](DEPLOYMENT.md) for the step-by-step production deployment guide using Neon, Render, and Vercel. The deployment guide is intentionally excluded from Git and is available only in this local workspace.
