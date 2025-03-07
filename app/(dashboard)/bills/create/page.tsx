"use client";
import { useRouter } from "next/navigation";
import CreateBillClient from "./client";

function CreateBill() {
  const router = useRouter();
  return (
    <CreateBillClient
      onSuccess={function (): void {
        router.back();
      }}
    />
  );
}

export default CreateBill;
