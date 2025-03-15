"use client";

import { useInfiniteData } from "@/app/hooks/use-infinite-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import User from "@/models/user";
import { formatDistanceToNow } from "date-fns";
import {
  Calendar,
  Edit,
  Eye,
  Globe,
  Lock,
  Mail,
  Plus,
  Shield,
  Trash2,
  UserIcon,
} from "lucide-react";
import NextLink from "next/link";
import { useState } from "react";
import UsersListSkeleton from "./loading";
import Link from "next/link";

export default function UsersPage() {
  const [search, setSearch] = useState("");
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

  if (loading) {
    return <UsersListSkeleton />;
  }

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">
            Manage system users and their permissions
          </p>
        </div>
        <Link href={"/users/create"}>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <div className="flex items-start justify-between w-full">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {user.name}
                    {user.super_admin && (
                      <Badge className="bg-amber-500 hover:bg-amber-600 ml-2">
                        Super Admin
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Mail className="h-3 w-3" />
                    {user.email}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {user.active ? (
                    <Badge
                      variant="outline"
                      className="border-green-500 text-green-500"
                    >
                      Active
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-red-500 text-red-500"
                    >
                      Inactive
                    </Badge>
                  )}
                  {user.is_public ? (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Globe className="h-3 w-3" />
                      Public
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Lock className="h-3 w-3" />
                      Private
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    Username:{" "}
                    <span className="font-medium">{user.username}</span>
                  </span>
                </div>

                {user.role ? (
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      Role:{" "}
                      <span className="font-medium">{user.role.name}</span>
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-amber-500" />
                    <span className="text-sm font-medium text-amber-600">
                      Super Administrator
                    </span>
                  </div>
                )}

                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    Created{" "}
                    {formatDistanceToNow(new Date(user.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <NextLink href={`/users/${user.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Eye className="h-4 w-4" />
                  View
                </Button>
              </NextLink>
              <Link href={`/users/create?edit=${user.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
