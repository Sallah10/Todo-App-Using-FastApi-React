import { useState } from "react";

function TodoItem({ todo, onToggle, onDelete, onUpdateTitle }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const [saving, setSaving] = useState(false);

  function startEditing() {
    setDraft(todo.title);
    setEditing(true);
  }

  function cancelEditing() {
    setDraft(todo.title);
    setEditing(false);
  }

  async function saveTitle(event) {
    event.preventDefault();
    const title = draft.trim();
    if (!title || saving) return;
    if (title === todo.title) {
      cancelEditing();
      return;
    }

    setSaving(true);
    try {
      if (await onUpdateTitle(todo.id, title)) setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  function handleEditKeyDown(event) {
    if (event.key === "Escape" && !saving) cancelEditing();
  }

  return (
    <li className={todo.completed ? "todo completed" : "todo"}>
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id, !todo.completed)}
        aria-label={`Mark "${todo.title}" as ${todo.completed ? "not done" : "done"}`}
      />
      {editing ? (
        <form className="todo-edit-form" onSubmit={saveTitle}>
          <label className="visually-hidden" htmlFor={`edit-todo-${todo.id}`}>
            Edit task title
          </label>
          <input
            id={`edit-todo-${todo.id}`}
            className="todo-edit-input"
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleEditKeyDown}
            maxLength={200}
            autoFocus
            disabled={saving}
          />
          <div className="todo-edit-actions">
            <button
              type="submit"
              className="edit-save"
              disabled={!draft.trim() || saving}
            >
              {saving ? "Saving" : "Save"}
            </button>
            <button
              type="button"
              className="edit-cancel"
              onClick={cancelEditing}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <span className="todo-title">{todo.title}</span>
          <div className="todo-actions">
            <button
              type="button"
              className="edit-button"
              onClick={startEditing}
              aria-label={`Edit "${todo.title}"`}
            >
              Edit
            </button>
            <button
              type="button"
              className="delete-button"
              onClick={() => onDelete(todo.id)}
              aria-label={`Delete "${todo.title}"`}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}

export default TodoItem;
