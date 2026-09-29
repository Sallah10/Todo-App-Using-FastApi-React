import TodoItem from "./TodoItem.jsx";

function TodoList({ todos, onToggle, onDelete, onUpdateTitle, emptyMessage }) {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-index">00</span>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdateTitle={onUpdateTitle}
        />
      ))}
    </ul>
  );
}

export default TodoList;
