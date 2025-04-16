"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TextInput from "@/components/dashboard/textInput";
import ResultArea from "@/components/dashboard/resultArea";
import History from "@/components/dashboard/history";
import { ProcessType, TextProcess } from "@/lib/types";
import { isAuthenticated, removeAuthToken } from "@/lib/utils/auth";

export default function Dashboard() {
  const router = useRouter();
  const [result, setResult] = useState<{
    input: string;
    output: string;
    type: ProcessType;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    removeAuthToken();
    router.push("/login");
  };

  const handleResult = (newResult: {
    input: string;
    output: string;
    type: ProcessType;
  }) => {
    setResult(newResult);
  };

  const handleSelectHistoryItem = (item: TextProcess) => {
    setResult({
      input: item.input_text,
      output: item.output_text,
      type: item.process_type as ProcessType,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold">ShortSummaryAI</h1>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main workspace */}
          <div className="flex-1">
            <div className="mb-8">
              <TextInput
                onResult={handleResult}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            </div>
            <div>
              <ResultArea result={result} />
            </div>
          </div>

          {/* Sidebar toggle for mobile */}
          <div className="lg:hidden flex justify-end mb-4">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md"
            >
              {showSidebar ? "Hide History" : "Show History"}
            </button>
          </div>

          {/* History sidebar */}
          <div
            className={`lg:w-80 ${showSidebar ? "block" : "hidden lg:block"}`}
          >
            <div className="bg-white p-4 rounded-lg shadow-sm h-full">
              <History onSelectItem={handleSelectHistoryItem} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
