"use client";
import CreateClientClient from "./client";
import { useRouter } from "next/navigation";

function CreateClient() {
  const router = useRouter();
  return (
    <div className="w-[700px] mx-auto h-full center p-4">
      <CreateClientClient onSuccess={() => router.back()} />
    </div>
  );
}

export default CreateClient;
