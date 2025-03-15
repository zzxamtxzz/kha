import { getUser } from "@/auth/user";
import { PageHeader } from "@/components/page-header";
import CreateDeviceForm from "./form";

export default async function CreateDevicePage() {
  const user = await getUser();
  if (!user) return null;
  if (!user.super_admin && !user.role?.permissions?.devices?.includes("create"))
    return null;

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Page header */}
      <PageHeader
        title="Create New Device"
        description="Add a new device to your inventory"
      />
      <CreateDeviceForm />
    </div>
  );
}
