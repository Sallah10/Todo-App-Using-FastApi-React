import { useCallback, useEffect, useState } from "react";
import { api } from "./api/todos.js";
import AddTodo from "./components/AddTodo.jsx";
import TodoList from "./components/TodoList.jsx";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      setTodos(await api.list());
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function handleAdd(title) {
    try {
      const created = await api.create(title);
      setTodos((current) => [...current, created]);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggle(id, completed) {
    try {
      const updated = await api.setCompleted(id, completed);
      setTodos((current) =>
        current.map((todo) => (todo.id === id ? updated : todo)),
      );
      setError("");
    } catch (err) {
      setError(err.message);
      refresh();
    }
  }

  async function handleDelete(id) {
    try {
      await api.remove(id);
      setTodos((current) => current.filter((todo) => todo.id !== id));
      setError("");
    } catch (err) {
      setError(err.message);
      refresh();
    }
  }

  const remaining = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="app">
      <header>
        <h1>Todos</h1>
        <p className="subtitle">
          {loading
            ? "Loading…"
            : `${remaining} remaining of ${todos.length} - FastAPI + React`}
        </p>
      </header>

      <AddTodo onAdd={handleAdd} disabled={loading} />

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />
    </div>
  );
}

export default App;
