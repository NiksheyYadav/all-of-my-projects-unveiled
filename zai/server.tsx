"use client";
import { useState } from "react";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");

  async function handleGenerate() {
    const res = await fetch("http://localhost:8000/api/image/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setResult(data.image_url);
  }

  return (
    <div className="flex flex-col items-center p-6">
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt..."
        className="border p-2 w-80 rounded-lg mb-4"
      />
      <button
        onClick={handleGenerate}
        className="px-4 py-2 bg-green-500 text-white rounded-lg"
      >
        Generate
      </button>
      {result && <img src={result} alt="AI Output" className="mt-4 rounded-xl" />}
    </div>
  );
}
