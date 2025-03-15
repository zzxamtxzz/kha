"use client";
import { useInfiniteData } from "@/app/hooks/use-infinite-data";
import axios from "@/axios";
import SpinLoading from "@/components/loadings/spinloading";
import DynamicTable from "@/components/table/page";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import User from "@/models/user";
import { useQueryClient } from "@tanstack/react-query";
import { UserRoundPlus, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function UsersClient() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const search = searchParams.get("search");
  const {
    data: users,
    loading,
    queryKey,
    count,
    lastElementRef,
  } = useInfiniteData<User>({
    keys: "users",
    size: 20,
    params: { search },
  });

  const { data: roles, loading: roleLoading } = useInfiniteData<User>({
    keys: "roles",
    size: 20,
    params: { search },
  });
  if (loading || roleLoading) return <SpinLoading />;

  return <pre>{JSON.stringify(users, null, 2)}</pre>;

  return (
    <div className="h-screen overflow-y-auto">
      <div className="flex items-center p-2 justify-between card-bg">
        <div className="flex items-center">
          <Link
            href={"/home"}
            className={cn(
              buttonVariants({
                variant: "outline",
                className: "p-0 h-10 w-10 rounded-full",
              })
            )}
          >
            <X className="w-5" />
          </Link>
          <p className="px-4">Users {count}</p>
        </div>
        <Link
          className={cn(buttonVariants({ variant: "default" }))}
          href={"/users/create"}
        >
          <span className="px-2">Create User </span>{" "}
          <UserRoundPlus className="w-4" />
        </Link>
      </div>
      <div className="w-full h-full">
        <DynamicTable<User>
          lastElementRef={lastElementRef}
          loading={loading}
          data={users}
          columns={[
            { name: "name" },
            { name: "username" },
            { name: "email" },
            {
              name: "role",
              cell: ({ value, id, super_admin }) => {
                return (
                  <Select
                    value={super_admin ? "super_admin" : value?.id}
                    onValueChange={async (value) => {
                      try {
                        let data: any = { role_id: value };
                        if (value === "super_admin") {
                          data = { super_amin: true };
                        } else {
                          data.super_admin = false;
                        }
                        const response = await axios.put(
                          `/api/users/${id}`,
                          data
                        );
                        const existData = queryClient.getQueryData(
                          queryKey
                        ) as { pageParams: number[]; pages: User[][] };

                        if (existData) {
                          queryClient.setQueryData(queryKey, {
                            ...existData,
                            pages: existData.pages.map((page) =>
                              page.map((d) =>
                                d.id === id ? { ...d, ...response.data } : d
                              )
                            ),
                          });
                        }
                      } catch (error: any) {
                        toast({
                          title: "Error found",
                          description:
                            error.response?.data?.error || error.message,
                        });
                      }
                    }}
                    defaultValue={value}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={value} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="super_admin">Super admin</SelectItem>
                      {roles.map((r) => (
                        <SelectItem value={r.id}>{r.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              },
            },
            {
              name: "active",
              cell: ({ value, id }) => {
                return (
                  <Select
                    onValueChange={async (value) => {
                      try {
                        const response = await axios.put(`/api/users/${id}`, {
                          active: value,
                        });
                        const existData = queryClient.getQueryData(
                          queryKey
                        ) as { pageParams: number[]; pages: User[][] };

                        if (existData) {
                          queryClient.setQueryData(queryKey, {
                            ...existData,
                            pages: existData.pages.map((page) =>
                              page.map((d) =>
                                d.id === id ? { ...d, ...response.data } : d
                              )
                            ),
                          });
                        }
                      } catch (error: any) {
                        toast({
                          title: "Error found",
                          description:
                            error.response?.data?.error || error.message,
                        });
                      }
                    }}
                    defaultValue={value.toString()}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Active" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={"true"}>Active</SelectItem>
                      <SelectItem value={"false"}>Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                );
              },
            },
            { name: "client" },
          ]}
          title={"users"}
        />
      </div>
    </div>
  );
}

export default UsersClient;
