"use client";
/* eslint-disable */

import { useEffect, useState } from "react";
import { textApi } from "@/lib/api/client";
import type { TextProcess, ProcessType } from "@/lib/types";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, FileText, ListChecks, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <div className="h-full flex flex-col ">
      <CardHeader className="pb-3 pt-5">
        <CardTitle>History</CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex mb-4 space-x-2">
          <Button
            onClick={() => setActiveFilter("all")}
            variant={activeFilter === "all" ? "default" : "outline"}
            size="sm"
          >
            All
          </Button>
          <Button
            onClick={() => setActiveFilter("summary")}
            variant={activeFilter === "summary" ? "default" : "outline"}
            size="sm"
          >
            <FileText className="mr-1 h-3 w-3" />
            Summaries
          </Button>
          <Button
            onClick={() => setActiveFilter("bullet_points")}
            variant={activeFilter === "bullet_points" ? "default" : "outline"}
            size="sm"
          >
            <ListChecks className="mr-1 h-3 w-3" />
            Bullets
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <ScrollArea className="flex-1 -mx-2 px-2">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No history found
            </div>
          ) : (
            <ul className="space-y-3">
              {history.map((item) => (
                <li
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className="p-3 cursor-pointer rounded-md hover:bg-accent border border-border/60 transition-colors"
                >
                  <div className="flex justify-between items-center mb-2">
                    <Badge
                      variant={
                        item.process_type === "summary"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {item.process_type === "summary" ? (
                        <FileText className="mr-1 h-3 w-3" />
                      ) : (
                        <ListChecks className="mr-1 h-3 w-3" />
                      )}
                      {item.process_type === "summary"
                        ? "Summary"
                        : "Bullet Points"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm truncate">{item.input_text}</p>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
    </div>
  );
}
