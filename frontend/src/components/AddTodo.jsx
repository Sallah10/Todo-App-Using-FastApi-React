import { useState } from 'react'

function AddTodo({ onAdd, disabled }) {
  const [title, setTitle] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setTitle('')
  }

  return (
    <form className="add-todo" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="What needs doing?"
        aria-label="New todo"
        maxLength={200}
        disabled={disabled}
      />
      <button type="submit" disabled={disabled || !title.trim()}>
        Add
      </button>
    </form>
  )
}

export default AddTodo
