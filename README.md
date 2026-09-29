# Todo App

Two parts, run separately. Backend first.

- `backend/` — FastAPI + SQLAlchemy + SQLite
- `frontend/` — React (Vite)

## Run the backend

```bash
cd backend
python -m venv .venv
.venv/Scripts/python.exe -m pip install -r requirements.txt   # Windows
.venv/Scripts/python.exe -m uvicorn main:app --reload --port 8000
```

Interactive API docs: <http://127.0.0.1:8000/docs>

Optional config — copy `backend/.env.example` to `backend/.env`
(`DATABASE_URL`, `CORS_ORIGINS`).

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

App: <http://127.0.0.1:5173>

Optional config — copy `frontend/.env.example` to `frontend/.env`
(`VITE_API_URL`, defaults to `http://127.0.0.1:8000`). Restart `npm run dev`
after changing it; Vite only reads env vars at startup.

## Tests and checks

```bash
cd backend  && .venv/Scripts/python.exe test_api.py   # endpoint + CORS checks
cd frontend && npm run lint && npm run build
```
