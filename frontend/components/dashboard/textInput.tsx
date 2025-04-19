"use client";
/* eslint-disable */

import { useState } from "react";
import { textApi } from "@/lib/api/client";
import type { ProcessType } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, FileText, ListChecks } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>Enter your text</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here to generate a summary or bullet points..."
          disabled={isProcessing}
          className="min-h-[200px] resize-y"
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => handleSubmit("summary")}
            disabled={isProcessing}
            className="flex-1"
            variant="default"
          >
            <FileText className="mr-2 h-4 w-4" />
            {isProcessing ? "Processing..." : "Generate Summary"}
          </Button>
          <Button
            onClick={() => handleSubmit("bullet_points")}
            disabled={isProcessing}
            className="flex-1"
            variant="secondary"
          >
            <ListChecks className="mr-2 h-4 w-4" />
            {isProcessing ? "Processing..." : "Generate Bullet Points"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
