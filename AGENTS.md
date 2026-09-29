# Todo App

FastAPI + SQLite backend, React (Vite) frontend. Two processes, run separately.

- `backend/` — `main.py` (app + CORS), `config.py` (env), `database.py` (engine/session), `models.py` (Todo), `schemas.py` (pydantic), `routes/todos.py`
- `frontend/` — `src/api/todos.js` (the only place that knows the API URL), `src/components/{AddTodo,TodoList,TodoItem}.jsx`, `src/App.jsx`

## Commands (Windows, verified)

```bash
# backend — MUST be run from inside backend/ (see gotchas)
cd backend
.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
# docs at http://127.0.0.1:8000/docs

# frontend
cd frontend
npm run dev      # http://127.0.0.1:5173
npm run lint     # oxlint
npm run build
```

Verify the backend (22 endpoint + CORS assertions, exits non-zero on failure):

```bash
cd backend
.venv\Scripts\python.exe test_api.py
```

Backend first, then frontend. Restart the frontend dev server after any env change.

## Gotchas

- **cwd matters for the backend.** `main.py` uses flat imports (`from database import ...`), so `uvicorn main:app` only works with cwd = `backend/`. From the repo root you get `ModuleNotFoundError: No module named 'main'`.
- **No bare `pip` on PATH.** Use `backend\.venv\Scripts\python.exe -m pip install -r requirements.txt`.
- **`VITE_API_URL` is baked in at Vite startup.** Editing `frontend/.env` does nothing until you restart `npm run dev`. Default is `http://127.0.0.1:8000`.
- **Changing the Vite port breaks CORS.** If you serve the frontend on a port other than 5173, add that origin to `CORS_ORIGINS` in `backend/.env` (or restart with a matching default) or every request fails.
- **Lint is oxlint, not ESLint** (`.oxlintrc.json`, no eslint dep). `npm run lint` exits 0 but prints a `react(set-state-in-effect)` warning at `App.jsx:24` for the fetch-on-mount effect. It is a false positive for synchronizing with an external system — do not "fix" it by dropping the effect or moving state.
- **`test_api.py` is a hand-rolled script, not pytest.** It sets `DATABASE_URL` to a temp file *before* importing the app, so it never touches `todos.db`. Keep that import-order guarantee if you edit it.
- **No frontend test framework is installed.** `npm run build` is the only compile-level check; for behaviour changes exercise the running app.
- Tables are created by `init_db()` in the `lifespan` handler. There is no migration tool — changing `models.py` does not alter an existing `todos.db`; delete it to re-create.
- Frontend is **JSX, not TSX** (even though `@types/react` is present). Style: single quotes, no semicolons, 2-space indent.

## API contract

The frontend depends on this exactly; changing a field name or status code breaks it silently.

| Method | Path | Body | Success |
| --- | --- | --- | --- |
| GET | `/todos` | — | `200` `[{id,title,completed,created_at}]` |
| POST | `/todos` | `{title, completed?}` | `201` todo |
| GET | `/todos/{id}` | — | `200` todo / `404` |
| PUT | `/todos/{id}` | `{title?, completed?}` (unset fields are left alone) | `200` todo / `404` |
| DELETE | `/todos/{id}` | — | `204` empty / `404` |
| GET | `/health` | — | `200` `{status:"ok"}` |

## Rules

- Keep endpoints RESTful: GET/POST/PUT/DELETE /todos
- Enable CORS for the frontend origin
- Read config from environment variables, never hardcode URLs or secrets (see `.env.example` in each package)
- Small commits with clear messages
- After each feature, tell the user how to run and test it
- Deploy only when it works locally
