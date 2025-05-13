import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { marked } from "marked";

const TrainingPage = () => {
  const { t, i18n } = useTranslation();

  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const callGeminiAPI = async (text) => {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    const payload = {
      contents: [
        {
          parts: [{ text }],
        },
      ],
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    const prompt = `You are an AI running coach. Only answer questions that are related to running, training plans, running form, pacing, recovery, injuries, gear, and related topics. 
    If the question is not related to running, reply with: "Sorry, I'm only trained to help with running-related topics."
    Keep your responses short and focused, providing only the most important and useful information to the user.
    Format the response using markdown.

    User's question: ${input}`;
    const data = await callGeminiAPI(prompt);
    setResponse(data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response");
    setLoading(false);
  };

  return (
    <div>
      <div className="border-b border-secondary px-4 py-3">
          <div className='text-primary text-xl font-semibold'>{t("training")}</div>
      </div>
      <div className="flex flex-col p-4">
        <form
          onSubmit={handleSubmit}
          className="w-100 flex flex-col gap-4 mb-6"
        >
          <input
            type="text"
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-primary shadow-sm outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            {loading ? "Loading..." : "Send"}
          </button>
        </form>

        <div className="w-full max-w-2xl bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Gemini Response:</h2>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: marked(response) }}
          />
        </div>
      </div>
    </div>
  );
};

export default TrainingPage;
