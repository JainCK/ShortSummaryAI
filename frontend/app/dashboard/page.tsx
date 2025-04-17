"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Layout,
  LayoutHeader,
  LayoutContent,
} from "@/components/dashboard/layout";
import TextInput from "@/components/dashboard/textInput";
import ResultArea from "@/components/dashboard/resultArea";
import History from "@/components/dashboard/history";
import type { ProcessType } from "@/lib/types";
import { removeAuthToken } from "@/lib/utils/auth";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, Zap } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Dashboard() {
  const router = useRouter();
  const [result, setResult] = useState<{
    input: string;
    output: string;
    type: ProcessType;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // useEffect(() => {
  //   // Redirect to login if not authenticated
  //   if (!isAuthenticated()) {
  //     router.push("/login");
  //   }
  // }, [router]);

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

  const handleSelectHistoryItem = (item: any) => {
    setResult({
      input: item.input_text,
      output: item.output_text,
      type: item.process_type as ProcessType,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground items-center flex flex-col">
      <Layout>
        <LayoutHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-primary p-1">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">ShortSummaryAI</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </LayoutHeader>

        <LayoutContent>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
            <div className="space-y-6">
              <TextInput
                onResult={handleResult}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
              <ResultArea result={result} />
            </div>

            {/* Mobile history toggle */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Menu className="h-4 w-4 mr-2" />
                    View History
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[350px] sm:w-[540px] p-0"
                >
                  <div className="h-full p-6">
                    <History onSelectItem={handleSelectHistoryItem} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop history sidebar */}
            <div className="hidden lg:block">
              <div className="bg-card rounded-lg border border-border h-[calc(100vh-140px)] overflow-hidden ">
                <History onSelectItem={handleSelectHistoryItem} />
              </div>
            </div>
          </div>
        </LayoutContent>
      </Layout>
    </div>
  );
}
