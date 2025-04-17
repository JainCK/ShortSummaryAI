"use client";

import type { ProcessType } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ListChecks, Clipboard } from "lucide-react";
import { useState } from "react";

interface ResultAreaProps {
  result: {
    input: string;
    output: string;
    type: ProcessType;
  } | null;
}

export default function ResultArea({ result }: ResultAreaProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (result?.output) {
      navigator.clipboard.writeText(result.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    }
  };

  if (!result) {
    return (
      <Card className="border-border/60 bg-card/50">
        <CardContent className="pt-6 text-center text-muted-foreground">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <p>Your processed text will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3 flex justify-between items-center">
        <CardTitle className="flex items-center text-lg">
          {result.type === "summary" ? (
            <>
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Summary
            </>
          ) : (
            <>
              <ListChecks className="mr-2 h-5 w-5 text-primary" />
              Bullet Points
            </>
          )}
        </CardTitle>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <Clipboard className="h-4 w-4" />
          {copied ? "Copied!" : "Copy"}
        </button>
      </CardHeader>
      <CardContent>
        <div className="prose prose-invert max-w-none">
          {result.type === "bullet_points" ? (
            <ul>
              {result.output.split("\n").map((line, idx) => (
                <li key={idx} className="list-disc text-white">
                  {line}
                </li>
              ))}
            </ul>
          ) : (
            result.output
              .split("\n")
              .map((line, idx) => <p key={idx}>{line}</p>)
          )}
        </div>
      </CardContent>
    </Card>
  );
}
