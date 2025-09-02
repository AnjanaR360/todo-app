"use client";
import { useState, useEffect } from "react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
  priority: "High" | "Medium" | "Low";
};

export default function Home() {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!task.trim()) return;
    setTodos([{ id: Date.now(), text: task.trim(), completed: false, priority }, ...todos]);
    setTask("");
    setPriority("Medium");
  };

  const toggleTodo = (id: number) =>
    setTodos(todos.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const deleteTodo = (id: number) => setTodos(todos.filter(t => t.id !== id));

  const startEdit = (id: number, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (id: number) => {
    if (!editText.trim()) return;
    setTodos(todos.map(t => (t.id === id ? { ...t, text: editText.trim() } : t)));
    setEditingId(null);
    setEditText("");
  };

  const completedCount = todos.filter(t => t.completed).length;

  return (
    <main className={`relative min-h-screen flex flex-col items-center p-8 transition-colors ${
      darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-100 to-purple-200 text-black"
    }`}>

      {/* Dark Mode Toggle Top-Right */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-4 right-4 px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      {/* Title */}
      <h1 className="text-4xl font-extrabold mb-6">My To-Do List</h1>

      {/* Input Section */}
      <div className="flex gap-2 mb-4">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          className="border p-3 rounded-xl w-64 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add a new task..."
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as "High" | "Medium" | "Low")}
          className="border p-3 rounded-xl"
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <button
          onClick={addTodo}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow-lg transition"
        >
          Add
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-80 bg-gray-300 rounded-full h-4 mb-2">
        <div
          className="bg-blue-500 h-4 rounded-full transition-all"
          style={{ width: `${(completedCount / todos.length) * 100 || 0}%` }}
        ></div>
      </div>

      {/* Counter */}
      <p className="mb-4 font-medium">
        ✅ {completedCount} / {todos.length} completed
      </p>

      {/* Bulk Actions */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTodos(todos.map(t => ({ ...t, completed: true })))}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Complete All
        </button>
        <button
          onClick={() => setTodos([])}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Clear All
        </button>
      </div>

      {/* Task List */}
      <ul className="space-y-3 w-96">
        {todos.map((t) => (
          <li
            key={t.id}
            className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-xl shadow hover:shadow-lg transition"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => toggleTodo(t.id)}
                className="w-5 h-5"
              />

              {editingId === t.id ? (
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.key === "Escape" && setEditingId(null)}
                  className="border rounded p-1"
                  autoFocus
                />
              ) : (
                <span className={`${t.completed ? "line-through text-gray-400" : "text-black dark:text-white"}`}>
                  {t.text}
                </span>
              )}

              {/* Priority Tag */}
              <span className={`px-2 py-1 rounded text-white text-xs ${
                t.priority === "High" ? "bg-red-500" : t.priority === "Medium" ? "bg-yellow-500" : "bg-green-500"
              }`}>
                {t.priority}
              </span>
            </div>

            <div className="flex gap-2">
              {editingId === t.id ? (
                <button onClick={() => saveEdit(t.id)} className="text-green-600 font-bold hover:text-green-700 transition">Save</button>
              ) : (
                <button onClick={() => startEdit(t.id, t.text)} className="text-blue-500 hover:text-blue-700 transition">Edit</button>
              )}
              <button onClick={() => deleteTodo(t.id)} className="text-red-500 font-bold hover:text-red-700 transition">✕</button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
