"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function BillError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] py-12 text-center">
      <AlertCircle className="h-24 w-24 text-destructive mb-6" />
      <h1 className="text-3xl font-bold tracking-tight mb-2">
        Something went wrong
      </h1>
      <p className="text-muted-foreground max-w-md mb-2">
        We encountered an error while trying to load this bill.
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        Error: {error.message || "Unknown error"}
      </p>
      <div className="flex gap-4">
        <Button onClick={reset} variant="default">
          Try again
        </Button>
        <Button variant="outline" asChild>
          <a href="/bills">Return to Bills</a>
        </Button>
      </div>
    </div>
  );
}
