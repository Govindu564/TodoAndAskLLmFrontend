"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PencilSquareIcon,
  CheckIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Loader2, MessageCircle } from "lucide-react";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
// const BACKEND_API_URL = 'https://todoandaskllmbackend.onrender.com';

const TodoLists = () => {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todos"));
    if (savedTodos) {
      setTodos(savedTodos);
    }
  }, []);

  // Recalculate progress whenever the todos list changes
  useEffect(() => {
    if (todos.length > 0) {
      const completedCount = todos.filter((todo) => todo.completed).length;
      setProgress((completedCount / todos.length) * 100);
    } else {
      setProgress(0);
    }
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${BACKEND_API_URL}/api/todos`);
      setTodos(res.data);
    } catch (error) {
      console.log("Error fetching todos:", error);
    }
  };

  const addTodo = async () => {
    if (!text) return;
    try {
      await axios.post(`${BACKEND_API_URL}/api/todos`, {
        title: text,
      });
      setText("");
      fetchTodos();
      setTodos([...todos, todo]);
    } catch (error) {
      console.log("Error adding todo:", error);
    }
  };

  const startEdit = (todo) => {
    setEditId(todo._id);
    setEditText(todo.title);
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`${BACKEND_API_URL}/api/todos/${id}`, {
        title: editText,
      });
      setEditId(null);
      setEditText("");
      fetchTodos();
    } catch (error) {
      console.log("Error updating todo:", error);
    }
  };

  // New function to toggle the completion status
  const handleToggleTodo = async (id) => {
    try {
      await axios.patch(`${BACKEND_API_URL}/api/todos/${id}`);
      fetchTodos();
    } catch (error) {
      console.log("Error toggling todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${BACKEND_API_URL}/api/todos/${id}`);
      fetchTodos();
    } catch (error) {
      console.log("Error deleting todo:", error);
    }
  };

  return (
    <div className="flex flex-col  overflow-hidden mt-5 mb-6">
      <div className="shadow-lg bg-white rounded-xl mx-0 md:mx-[85px] border border-gray-300">
        <div className="bg-gray-100 p-6 rounded-t-xl">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            {/* <MessageCircle className="h-6 w-6 text-indigo-600" /> */}
            To-Do Manager
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            A simple list to keep track of your tasks.
          </p>
        </div>
        <div className="p-6">
          <div className="flex mb-4 mt-5">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTodo();
              }}
              placeholder="Add your tasks"
              className="flex-grow border border-gray-300 rounded-md px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addTodo}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
          <ul className="space-y-3">
            {todos.map((todo) => (
              <li
                key={todo._id}
                className={`flex justify-between items-center p-3 rounded-md transition-colors duration-200 ${
                  todo.completed
                    ? "bg-green-50 text-gray-400 line-through"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <span className="text-gray-800">{todo.title}</span>
                <div className="flex items-center gap-3 pl-5">
                  <button onClick={() => handleToggleTodo(todo._id)}>
                    <CheckIcon
                      className={`h-5 w-5 transiton-colors duration-200 ${
                        todo.completed
                          ? "text-green-500"
                          : "text-gray-400 hover:text-green-500"
                      }`}
                    />
                  </button>
                  {editId === todo._id ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={() => saveEdit(todo._id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(todo._id);
                          if (e.key === "Escape") setEditId(null);
                        }}
                        className="flex-grow border  border-gray-300 rounded-md px-2 pt-1 text-sm focus:outline-none"
                        autoFocus
                      />
                      <button onClick={() => saveEdit(todo._id)}>
                        <CheckIcon className="h-5 w-5 text-white p-1 rounded-full bg-green-500 hover:bg-green-600 transition-colors" />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => startEdit(todo)}>
                      <PencilSquareIcon className="h-5 w-5 text-blue-500 hover:text-blue-600 transiton-colors" />
                    </button>
                  )}
                  <button onClick={() => deleteTodo(todo._id)}>
                    <TrashIcon className="h-5 w-5 text-red-500 hover:text-red-600 transition-colors" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <hr className="my-4 border-gray-300" />
          <p>Progress</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 mt-2">
            <div
              className="bg-green-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-center text-sm text-gray-600">
            {Math.round(progress)}% Complete
          </p>
        </div>
      </div>
    </div>
  );
};

export default TodoLists;
