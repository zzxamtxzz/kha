import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function BillNotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] py-12 text-center">
      <FileQuestion className="h-24 w-24 text-muted-foreground mb-6" />
      <h1 className="text-3xl font-bold tracking-tight mb-2">Bill Not Found</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        We couldn't find the bill you're looking for. It may have been deleted
        or the ID might be incorrect.
      </p>
      <Link href="/bills">
        <Button>Return to Bills</Button>
      </Link>
    </div>
  );
}
