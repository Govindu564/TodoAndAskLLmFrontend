import React from "react";
import TodoList from "./components/TodoLists";
import AskGemini from "./components/AskAnything";
export default function Home() {
  return (
    <>
      <h1 className=" text-center text-2xl font-semibold text-gray-900 mt-5 pt-5 mb-4">
        {" "}
        Welcome to Your Daily Companion{" "}
        <span className="text-blue-500"> To-Do Manager + Ask Gemini </span>
      </h1>
      <p className="text-center text-gray-800 mb-5 pb-5">
        stay organized and get instant Answer - all in one place
      </p>
      <div>
        <TodoList />
        <AskGemini />
      </div>
      <p className="text-center text-sm text-gray-500 mt-10 mb-5">
        Thank you for using{" "}
        <span className="text-blue-600 font-medium ">
          To-Do Manager + ask Gemini
        </span>
      </p>
      <p className="text-center text-sm text-gray-500 mb-15">
        We are to make your day simpler, one task and question at a time!
      </p>
    </>
  );
}
