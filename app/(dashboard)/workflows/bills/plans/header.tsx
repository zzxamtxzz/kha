"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function PlansHeaders({}) {
  const router = useRouter();
  return (
    <div className="flex items-center h-12 border-b justify-between px-2">
      <div className="flex items-center gap-2">
        <Button
          variant={"outline"}
          className="w-8 h-8 p-0 hover rounded-full"
          onClick={() => router.back()}
        >
          <X className="w-4" />
        </Button>{" "}
        <p className="font-semibold text-lg">Plans</p>
      </div>
      <Link
        className={cn(buttonVariants({ variant: "outline" }))}
        href={"/workflows/bills/plans/create"}
      >
        Create
      </Link>
    </div>
  );
}

export default PlansHeaders;
