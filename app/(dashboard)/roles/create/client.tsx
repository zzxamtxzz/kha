"use client";
import SpinLoading from "@/components/loadings/spinloading";
import RoleForm from "./form";
import useGetEdit from "@/app/hooks/useGetEdit";
import { modules } from "@/utils/name";
import RoleFormSkeleton from "./loading";

const permissions: { [key: string]: string[] } = {};
modules.forEach((name) => (permissions[name] = []));

function CreateRole() {
  const { loading, defaultValues } = useGetEdit({
    title: "roles",
    defaultValues: {
      name: "",
      home: ["home", "workflows"],
      permissions,
      all_records: [],
    },
  });

  if (loading) return <RoleFormSkeleton />;
  return <RoleForm defaultValues={defaultValues} />;
}

export default CreateRole;
