function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className={todo.completed ? 'todo completed' : 'todo'}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id, !todo.completed)}
        aria-label={`Mark "${todo.title}" as ${todo.completed ? 'not done' : 'done'}`}
      />
      <span className="todo-title">{todo.title}</span>
      <button
        type="button"
        className="delete"
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete "${todo.title}"`}
      >
        &times;
      </button>
    </li>
  )
}

export default TodoItem
