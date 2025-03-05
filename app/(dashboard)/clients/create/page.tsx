"use client";
import CreateClientClient from "./client";
import { useRouter } from "next/navigation";

function CreateClient() {
  const router = useRouter();
  return <CreateClientClient onSuccess={() => router.back()} />;
}

export default CreateClient;
