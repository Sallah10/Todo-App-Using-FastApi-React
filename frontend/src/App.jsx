import { useCallback, useEffect, useState } from "react";
import { api } from "./api/todos.js";
import AddTodo from "./components/AddTodo.jsx";
import Toast from "./components/Toast.jsx";
import TodoList from "./components/TodoList.jsx";
import "./App.css";

const today = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
}).format(new Date());

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");

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
      setToast("Task added");
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }

  async function handleUpdateTitle(id, title) {
    try {
      const updated = await api.updateTitle(id, title);
      setTodos((current) =>
        current.map((todo) => (todo.id === id ? updated : todo)),
      );
      setError("");
      setToast("Task updated");
      return true;
    } catch (err) {
      setError(err.message);
      return false;
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

  const completedCount = todos.filter((todo) => todo.completed).length;
  const remainingCount = todos.length - completedCount;
  const progress = todos.length
    ? Math.round((completedCount / todos.length) * 100)
    : 0;
  const visibleTodos = todos.filter((todo) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "open" && !todo.completed) ||
      (filter === "completed" && todo.completed);
    return (
      matchesFilter &&
      todo.title.toLowerCase().includes(query.trim().toLowerCase())
    );
  });

  const filterOptions = [
    { id: "all", label: "All", count: todos.length },
    { id: "open", label: "Open", count: remainingCount },
    { id: "completed", label: "Done", count: completedCount },
  ];

  let emptyMessage = "Your list is clear. Add your first task.";
  if (query.trim()) emptyMessage = "No tasks match that search.";
  else if (filter === "open") emptyMessage = "You are all caught up.";
  else if (filter === "completed") emptyMessage = "Nothing completed yet.";

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Sallah home">
          <span className="brand-mark" aria-hidden="true">
            S
          </span>
          <span>
            <b>Sallah</b>
          </span>
        </a>
        <span className="workspace-label">PERSONAL WORKSPACE</span>
      </header>

      <main className="workspace">
        <section className="day-overview" aria-label="Today's progress">
          <p className="eyebrow">{today}</p>
          <h1>
            Today<span className="title-dot">.</span>
          </h1>
          <p className="overview-copy" aria-live="polite">
            {loading
              ? "Getting things in order."
              : remainingCount === 0
                ? "All clear for now."
                : `${remainingCount} ${remainingCount === 1 ? "task" : "tasks"} still in play.`}
          </p>

          <div className="day-progress">
            <div className="progress-heading">
              <span className="eyebrow">DAY PROGRESS</span>
              <span className="progress-percent">{progress}%</span>
            </div>
            <div
              className="progress-track"
              role="progressbar"
              aria-label="Tasks completed"
              aria-valuemin="0"
              aria-valuemax={todos.length || 1}
              aria-valuenow={completedCount}
            >
              <span style={{ width: `${progress}%` }} />
            </div>
            <div className="progress-totals">
              <span>{completedCount} done</span>
              <span>{todos.length} total</span>
            </div>
          </div>

          <div className="day-note">
            <span className="note-index">01</span>
            <p>Small steps add up.</p>
          </div>
        </section>

        <section className="task-workspace" aria-label="Todo list">
          <div className="list-heading">
            <div>
              <p className="eyebrow">YOUR TASKS</p>
              <h2>The list</h2>
            </div>
            <p className="item-total">
              {String(todos.length).padStart(2, "0")} <span>items</span>
            </p>
          </div>

          <AddTodo onAdd={handleAdd} disabled={loading} />

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          <div className="list-tools">
            <div className="filter-tabs" role="group" aria-label="Filter tasks">
              {filterOptions.map((option) => (
                <button
                  className={
                    filter === option.id ? "filter-tab active" : "filter-tab"
                  }
                  type="button"
                  aria-pressed={filter === option.id}
                  key={option.id}
                  onClick={() => setFilter(option.id)}
                >
                  {option.label}
                  <span>{option.count}</span>
                </button>
              ))}
            </div>
            <label className="search-box">
              <span className="visually-hidden">Search tasks</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search"
              />
              <span className="search-mark" aria-hidden="true" />
            </label>
          </div>

          {loading ? (
            <p className="loading-state" role="status">
              Loading your tasks...
            </p>
          ) : (
            <TodoList
              todos={visibleTodos}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onUpdateTitle={handleUpdateTitle}
              emptyMessage={emptyMessage}
            />
          )}
        </section>
      </main>

      <footer className="footer">
        <span>
          <a
            href="https://bello-muhammed.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Sallah
          </a>{" "}
          / DAILY WORKLIST
        </span>
        <span>ONE THING AT A TIME</span>
      </footer>
      <Toast message={toast} onDismiss={() => setToast("")} />
    </div>
  );
}

export default App;
