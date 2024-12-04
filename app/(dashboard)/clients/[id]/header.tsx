"use client";
import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ClientMenu } from "./menu";

function ClientDetailHeader() {
  const { id } = useParams();
  const router = useRouter();
  return (
    <CardHeader className="p-4 border-b flex items-center justify-between w-full">
      <Button
        variant={"outline"}
        onClick={() => router.back()}
        type="reset"
        className="w-8 h-8 rounded-full p-0 left-1 top-0"
      >
        <ArrowLeft className="w-4" />
      </Button>
      <p className="font-bold text-lg text-center px-2">Creating New Client</p>
      <ClientMenu data={id as string} title="clients" />
    </CardHeader>
  );
}

export default ClientDetailHeader;
