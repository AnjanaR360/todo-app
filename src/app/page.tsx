"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState<string[]>([]);

  // load todos from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  // save todos to localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (task.trim() === "") return;
    setTodos([...todos, task]);
    setTask("");
  };

  const removeTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <main className="flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">My To-Do List</h1>
      
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="border p-2 rounded w-64"
          placeholder="Add a new task"
        />
        <button
          onClick={addTodo}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2 w-72">
        {todos.map((t, i) => (
          <li
            key={i}
            className="flex justify-between items-center bg-gray-100 p-2 rounded"
          >
            <span>{t}</span>
            <button
              onClick={() => removeTodo(i)}
              className="text-red-500 font-bold"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
