import { PageHeader } from "@/components/page-header";
import CreateRoleClient from "./client";

async function CreateRole() {
  return (
    <div className="container mx-auto py-6 max-w-[1000px]">
      <PageHeader
        title="Create New Role"
        description="Create a new role for a user"
        className="mb-8"
      />
      <div className="rounded-lg border bg-card p-8 shadow-sm">
        <CreateRoleClient />
      </div>
    </div>
  );
}

export default CreateRole;
