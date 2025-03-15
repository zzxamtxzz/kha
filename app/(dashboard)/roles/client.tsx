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
import Role from "@/models/role";
import { formatDistanceToNow } from "date-fns";
import {
  CheckCircle2,
  Edit,
  Eye,
  Globe,
  Lock,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import RolesListSkeleton from "./loading";

export default function RolesPage() {
  const {
    data: roles,
    loading,
    queryKey,
    lastElementRef,
    count,
    refetch,
  } = useInfiniteData<Role>({
    keys: "roles",
    size: 20,
    params: {},
  });

  if (loading) {
    return <RolesListSkeleton />;
  }

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Roles</h1>
          <p className="text-muted-foreground">
            Manage user roles and permissions
          </p>
        </div>
        <Link href={"/roles/create"}>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Role
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <div className="flex items-start justify-between w-full">
                <div>
                  <CardTitle>{role.name}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {role.is_public ? (
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                {Object.entries({
                  Bills: role.bills,
                  Clients: role.clients,
                  Currencies: role.currencies,
                  Plans: role.plans,
                  Devices: role.devices,
                  Branches: role.branches,
                  Users: role.users,
                }).map(([module, hasAccess]) => (
                  <div key={module} className="flex items-center">
                    {hasAccess ? (
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2 text-red-500" />
                    )}
                    <span className={hasAccess ? "" : "text-muted-foreground"}>
                      {module}
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                Created{" "}
                {formatDistanceToNow(new Date(role.created_at), {
                  addSuffix: true,
                })}{" "}
                by {role.created_by?.name || "Unknown"}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Link href={`/roles/${role.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Eye className="h-4 w-4" />
                  View
                </Button>
              </Link>
              <Link href={`/roles/create?edit=${role.id}`}>
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
