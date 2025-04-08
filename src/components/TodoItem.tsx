import React from 'react';

const TodoItem = ({ todo, handleChangeProps, deleteTodoProps }) => {
  const completedStyle = {
    fontStyle: 'italic',
    color: '#d35e0f',
    opacity: 0.4,
    textDecoration: 'line-through',
  };

  const { completed, id, title } = todo;

  return (
    <li className='todo-item'>
      <input
        type='checkbox'
        checked={completed}
        onChange={() => handleChangeProps(id)}
      />
      <button onClick={() => deleteTodoProps(id)}>Delete</button>
      <span style={completed ? completedStyle : undefined}>{title}</span>
    </li>
  );
};

export default TodoItem;
