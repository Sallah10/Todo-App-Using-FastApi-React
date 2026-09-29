import os
import sys
import tempfile

# Point the app at a throwaway DB *before* importing it, so running this never
# wipes the developer database in todos.db.
os.environ["DATABASE_URL"] = "sqlite:///" + os.path.join(tempfile.gettempdir(), "todos_test.db")

from fastapi.testclient import TestClient  # noqa: E402

from database import init_db  # noqa: E402
from main import app  # noqa: E402

init_db()

client = TestClient(app)
failures: list[str] = []


def check(name: str, condition: bool, detail: object = "") -> None:
    print(f"{'PASS' if condition else 'FAIL'}  {name}" + (f"  -> {detail}" if not condition else ""))
    if not condition:
        failures.append(name)


check("GET /health", client.get("/health").json() == {"status": "ok"})
check("GET /docs is served", client.get("/docs").status_code == 200)
check("GET /openapi.json is served", client.get("/openapi.json").status_code == 200)

r = client.post("/todos", json={"title": "Write the backend"})
check("POST /todos returns 201", r.status_code == 201, r.text)
created = r.json()
check("POST /todos defaults completed=false", created["completed"] is False, created)
check("POST /todos returns an id", isinstance(created.get("id"), int), created)
check("POST /todos returns created_at", "created_at" in created, created)

todo_id = created["id"]

check("GET /todos lists it", [t["id"] for t in client.get("/todos").json()] == [todo_id])
check("GET /todos/{id} returns it", client.get(f"/todos/{todo_id}").json()["title"] == "Write the backend")

r = client.put(f"/todos/{todo_id}", json={"completed": True})
check("PUT /todos/{id} toggles completed", r.status_code == 200 and r.json()["completed"] is True, r.text)
check("PUT /todos/{id} keeps title", r.json()["title"] == "Write the backend", r.json())

r = client.put(f"/todos/{todo_id}", json={"title": "Renamed"})
check("PUT /todos/{id} updates title", r.json()["title"] == "Renamed", r.json())
check("PUT /todos/{id} keeps completed", r.json()["completed"] is True, r.json())

check("POST /todos rejects empty title", client.post("/todos", json={"title": ""}).status_code == 422)
check("GET /todos/{id} 404s for missing", client.get("/todos/9999").status_code == 404)
check("PUT /todos/{id} 404s for missing", client.put("/todos/9999", json={"completed": True}).status_code == 404)
check("DELETE /todos/{id} 404s for missing", client.delete("/todos/9999").status_code == 404)

r = client.delete(f"/todos/{todo_id}")
check("DELETE /todos/{id} returns 204", r.status_code == 204, r.text)
check("DELETE /todos/{id} has empty body", r.content == b"", r.content)
check("GET /todos is empty after delete", client.get("/todos").json() == [])

r = client.options(
    "/todos",
    headers={
        "Origin": "http://localhost:5173",
        "Access-Control-Request-Method": "POST",
    },
)
check(
    "CORS allows the frontend origin",
    r.headers.get("access-control-allow-origin") == "http://localhost:5173",
    dict(r.headers),
)
r = client.options(
    "/todos",
    headers={"Origin": "http://evil.example", "Access-Control-Request-Method": "POST"},
)
check("CORS rejects other origins", "access-control-allow-origin" not in r.headers, dict(r.headers))

print()
if failures:
    print(f"{len(failures)} failed: {', '.join(failures)}")
    sys.exit(1)
print("All checks passed.")
