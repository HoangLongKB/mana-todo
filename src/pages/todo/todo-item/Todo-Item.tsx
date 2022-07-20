import React from "react";
import { isTodoCompleted } from "../../../utils";
import "./../ToDo.scss";

const TodoItem = (props: any) => {
  const {
    todo,
    onUpdateTodoStatus,
    editingTodoId,
    toggleEditTodo,
    onUpdateTodo,
    onDeleteTodo
  } = props;

  return (
    <div className="todo__item">
      <input
        type="checkbox"
        checked={isTodoCompleted(todo)}
        onChange={(e) => onUpdateTodoStatus(e, todo.id)}
      />
      {todo.id === editingTodoId ? (
        <input
          type="text"
          value={todo.name}
          autoFocus
          onBlur={() => toggleEditTodo("")}
          onChange={(e) => onUpdateTodo(e, todo.id)}
        />
      ) : (
        <p className="todo__name" onDoubleClick={() => toggleEditTodo(todo.id)}>
          {todo.name}
        </p>
      )}
      <button
        className="button button--danger todo__delete"
        onClick={() => onDeleteTodo(todo.id)}
      >
        X
      </button>
    </div>
  );
};

export default TodoItem;
