"use client";

import type { ProcessType } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ListChecks } from "lucide-react";

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
      <CardHeader className="pb-3">
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
      </CardHeader>
      <CardContent>
        <div className="prose prose-invert max-w-none">
          {result.output.split("\n").map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
