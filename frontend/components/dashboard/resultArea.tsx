"use client";

import { ProcessType } from "@/lib/types";

interface ResultAreaProps {
  result: {
    input: string;
    output: string;
    type: ProcessType;
  } | null;
}

export default function ResultArea({ result }: ResultAreaProps) {
  if (!result) {
    return (
      <div className="p-8 bg-gray-50 rounded-lg border border-gray-200 text-center text-gray-500">
        Your processed text will appear here
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          {result.type === "summary" ? "Summary" : "Bullet Points"}
        </h3>
      </div>

      <div className="prose max-w-none">
        {result.output.split("\n").map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>
    </div>
  );
}
