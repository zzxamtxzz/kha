"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function DeviceError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl h-full center">
      <Card className="mx-auto max-w-md border-destructive/50">
        <CardHeader className="text-center pb-2">
          <div className="w-20 h-20 bg-destructive/10 rounded-full mx-auto mb-4 flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p className="mb-2">
            We encountered an error while trying to load this device.
          </p>
          <p className="text-sm text-muted-foreground/80">
            Error: {error.message || "Unknown error"}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4 pb-6">
          <Button variant="outline" onClick={reset}>
            Try Again
          </Button>
          <Button asChild>
            <Link href="/workflows/devices">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Devices
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
