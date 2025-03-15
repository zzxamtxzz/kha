"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

function PlansHeaders({}) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between px-4">
      <h2 className="font-semibold text-lg">Currencies</h2>
      <Button
        variant={"outline"}
        className="w-8 h-8 p-0 hover rounded-full"
        onClick={() => router.back()}
      >
        <X className="w-4" />
      </Button>
    </div>
  );
}

export default PlansHeaders;
