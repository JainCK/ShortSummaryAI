"use client";

import { useState } from "react";
import { textApi } from "@/lib/api/client";
import { ProcessType } from "@/lib/types";

interface TextInputProps {
  onResult: (result: {
    input: string;
    output: string;
    type: ProcessType;
  }) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
}

export default function TextInput({
  onResult,
  isProcessing,
  setIsProcessing,
}: TextInputProps) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (type: ProcessType) => {
    if (!text.trim()) {
      setError("Please enter some text to process");
      return;
    }

    setError("");
    setIsProcessing(true);

    try {
      let response;
      if (type === "summary") {
        response = await textApi.generateSummary(text);
      } else {
        response = await textApi.generateBulletPoints(text);
      }

      onResult({
        input: text,
        output: response.data.output_text,
        type,
      });
    } catch (error: any) {
      console.error("Processing error:", error);
      setError(
        error.response?.data?.detail ||
          "Failed to process text. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 mb-4 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="text" className="block text-gray-700 font-medium mb-2">
          Enter your text
        </label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Paste your text here to generate a summary or bullet points..."
          disabled={isProcessing}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => handleSubmit("summary")}
          disabled={isProcessing}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
        >
          {isProcessing ? "Processing..." : "Generate Summary"}
        </button>
        <button
          onClick={() => handleSubmit("bullet_points")}
          disabled={isProcessing}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-300"
        >
          {isProcessing ? "Processing..." : "Generate Bullet Points"}
        </button>
      </div>
    </div>
  );
}
