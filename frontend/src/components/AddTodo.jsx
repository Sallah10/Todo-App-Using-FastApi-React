import { useState } from "react";

function AddTodo({ onAdd, disabled }) {
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    try {
      const saved = await onAdd(trimmed);
      if (saved) setTitle("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="add-todo" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Write down a task..."
        aria-label="New todo"
        maxLength={200}
        disabled={disabled}
      />
      <button type="submit" disabled={disabled || submitting || !title.trim()}>
        <span className="add-mark" aria-hidden="true">
          +
        </span>
        <span>{submitting ? "Adding" : "Add task"}</span>
      </button>
    </form>
  );
}

export default AddTodo;
