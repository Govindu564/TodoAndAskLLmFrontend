"use client";
import React, { useState } from "react";
import axios from "axios";
import { Loader2, MessageCircle } from "lucide-react";

// const BACKEND_API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ask`;
const BACKEND_API_URL = 'https://todoandaskllmbackend.onrender.com/api/ask';

const AskGemini = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAsk = async () => {
    if (!question.trim()) return;
    try {
      setLoading(true);
      setError(null);
      setAnswer("");

      const response = await axios.post(BACKEND_API_URL, { question });
      const text = response.data?.answer || "no answer found";
      setAnswer(text);
    } catch (error) {
      console.error("Error getting response from backend:", error);
      setError("something went wrong. please Check Your Server");
      setAnswer("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden mt-8 mb-5">
      <div className="shadow-lg rounded-xl mx-0 md:mx-[85px] border border-gray-300">
        <div className="bg-gray-100 p-6 rounded-t-x">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-indigo-600" />
            Ask Anything
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Ask a question and get a basic answer from an LLm
          </p>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <label htmlFor="llm-question" className="text-sm font-medium">
                Your Question
              </label>
              <textarea
                id="llm-question"
                placeholder="Ask a question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={loading}
                className="flex min-h-[80px] w-full resize-none overflow-y-auto rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>
            <button
              onClick={handleAsk}
              disabled={loading || !question.trim()}
              className="w-full rounded-lg shadow-md hover:shadow-lg transition-shadow text-white p-3 bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Asking...
                </>
              ) : (
                "Ask"
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 text-red-500 bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          {answer && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-inner">
              <strong className="font-semibold">Answer : </strong>
              {answer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AskGemini;
