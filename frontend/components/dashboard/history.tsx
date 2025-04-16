"use client";

import { useEffect, useState } from "react";
import { textApi } from "@/lib/api/client";
import { TextProcess, ProcessType } from "@/lib/types";

interface HistoryProps {
  onSelectItem: (item: TextProcess) => void;
}

export default function History({ onSelectItem }: HistoryProps) {
  const [history, setHistory] = useState<TextProcess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState<ProcessType | "all">("all");

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const params =
        activeFilter !== "all" ? { process_type: activeFilter } : undefined;
      const response = await textApi.getHistory(params);
      setHistory(response.data.items);
    } catch (error) {
      console.error("Error loading history:", error);
      setError("Failed to load history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [activeFilter]);

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4">History</h2>

      <div className="flex mb-4 space-x-2">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-3 py-1 text-sm rounded-md ${
            activeFilter === "all"
              ? "bg-gray-200 text-gray-800"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter("summary")}
          className={`px-3 py-1 text-sm rounded-md ${
            activeFilter === "summary"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Summaries
        </button>
        <button
          onClick={() => setActiveFilter("bullet_points")}
          className={`px-3 py-1 text-sm rounded-md ${
            activeFilter === "bullet_points"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Bullet Points
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 mb-4 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No history found</div>
        ) : (
          <ul className="space-y-2">
            {history.map((item) => (
              <li
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="p-3 cursor-pointer rounded-md hover:bg-gray-100 border border-gray-200"
              >
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      item.process_type === "summary"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {item.process_type === "summary"
                      ? "Summary"
                      : "Bullet Points"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm truncate">{item.input_text}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
