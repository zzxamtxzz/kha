"use client";

import useGetEdit from "@/app/hooks/useGetEdit";
import User from "@/models/user";
import CreateUserClient from "./form";
import CreateUserSkeleton from "./loading";

export default function CreateUserPage() {
  const { defaultValues, loading } = useGetEdit<User>({
    title: "users",
  });

  if (loading) return <CreateUserSkeleton />;

  return <CreateUserClient defaultValues={defaultValues} />;
}
