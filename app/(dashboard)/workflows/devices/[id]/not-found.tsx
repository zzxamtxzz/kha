import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DeviceNotFound() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl h-full center">
      <Card className="mx-auto max-w-md border-destructive/50">
        <CardHeader className="text-center pb-2">
          <div className="w-20 h-20 bg-destructive/10 rounded-full mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Device Not Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p className="mb-2">
            The device you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <p>It may have been deleted, or the URL might be incorrect.</p>
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          <Button asChild>
            <Link href="/devices">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Devices
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
