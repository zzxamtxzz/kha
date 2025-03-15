"use client";
import { useRouter } from "next/navigation";
import CreateBranchClient from "./client";
import { cn } from "@/lib/utils";

function CreateBranch({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <div className={cn("center w-[400px] mx-auto p-8", className)}>
      <CreateBranchClient onSuccess={() => router.back()} />
    </div>
  );
}

export default CreateBranch;
