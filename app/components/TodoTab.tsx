"use client";

import { useState } from "react";

type Todo = { id: number; text: string; done: boolean };

export default function TodoTab() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Build the Wahaj app", done: true },
    { id: 2, text: "Push to GitHub", done: false },
  ]);
  const [input, setInput] = useState("");

  function add() {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text: trimmed, done: false },
    ]);
    setInput("");
  }

  function toggle(id: number) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function remove(id: number) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-5">My Todos</h2>
      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Add a task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button
          onClick={add}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
        >
          Add
        </button>
      </div>
      {todos.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-6">
          No tasks yet. Add one above!
        </p>
      )}
      <ul className="flex flex-col gap-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
          >
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggle(todo.id)}
              className="w-4 h-4 accent-blue-600 cursor-pointer shrink-0"
            />
            <span
              className={`flex-1 text-sm ${
                todo.done ? "line-through text-gray-400" : "text-gray-700"
              }`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => remove(todo.id)}
              className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
              aria-label="Delete"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <p className="text-xs text-gray-400 mt-4 text-right">
        {todos.filter((t) => t.done).length}/{todos.length} done
      </p>
    </div>
  );
}
