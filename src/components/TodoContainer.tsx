import React, { useState } from 'react';
import TodosList from './TodosList';
import Header from './Header';
import InputTodo from './InputTodo';
// import uuid from "uuid";
import { v4 as uuidv4 } from 'uuid';

const todoList = [
  {
    // id: uuid.v4(),
    id: uuidv4(),
    title: 'Setup development environment',
    completed: true,
  },
  {
    // id: uuid.v4(),
    id: uuidv4(),
    title: 'Develop website and add content',
    completed: false,
  },
  {
    // id: uuid.v4(),
    id: uuidv4(),
    title: 'Deploy to live server',
    completed: false,
  },
];
const TodoContainer = () => {
  const [todos, setTodos] = useState([...todoList]);

  const handleChange = (id) => {
    setTodos((prevState) =>
      prevState.map((todo) => {
        if (todo.id === id) {
          todo.completed = !todo.completed;
        }
        return todo;
      })
    );
  };
  const delTodo = (id) => {
    setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
  };

  const addTodoItem = (title: string) => {
    const newTodo = {
      id: uuidv4(),
      title: title,
      completed: false,
    };
    setTodos([...todos, newTodo]);
  };
  return (
    <div className='container'>
      <Header />
      <InputTodo addTodoProps={addTodoItem} />
      <TodosList
        todos={todos}
        handleChangeProps={handleChange}
        deleteTodoProps={delTodo}
      />
    </div>
  );
};

export default TodoContainer;
