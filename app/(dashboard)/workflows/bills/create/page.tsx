"use client";
import { useHasUser } from "@/app/contexts/user";
import { useRouter } from "next/navigation";
import CreateBillClient from "./client";
import { PageHeader } from "@/components/page-header";

function CreateBill() {
  const router = useRouter();
  const { user } = useHasUser();

  if (!user.super_admin && !user.role?.permissions?.bills?.includes("create")) {
    return null;
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Create New Bill"
        description="Create a new bill for a device"
        className="mb-8"
      />
      <div className="rounded-lg border bg-card p-8 shadow-sm">
        <CreateBillClient
          onClose={() => router.back()}
          onSuccess={function (): void {
            router.back();
          }}
        />
      </div>
    </div>
  );
}

export default CreateBill;
