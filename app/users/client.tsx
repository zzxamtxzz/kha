"use client";
import axios from "@/axios";
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
import { useInfiniteData } from "../hooks/useInfiniteData";

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

  return (
    <div className="h-screen overflow-y-auto">
      <div className="flex items-center p-2 justify-between cart-bg">
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
            { name: "id" },
            { name: "profile" },
            { name: "name" },
            { name: "email" },
            {
              name: "role",
              cell: ({ value, id }) => {
                return (
                  <Select
                    onValueChange={async (value) => {
                      try {
                        const response = await axios.put(`/api/users/${id}`, {
                          role: value,
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
                    defaultValue={value}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={value} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
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
