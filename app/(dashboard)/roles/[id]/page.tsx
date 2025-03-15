"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  XCircle,
  Calendar,
  User,
  Globe,
  Lock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useDetail } from "@/app/hooks/useDetail";
import Role from "@/models/role";
import RoleViewSkeleton from "./loading";

const env = process.env.NEXT_PUBLIC_NODE_ENV === "development";
export default function RoleViewPage() {
  const params = useParams();
  const { data: role, isLoading } = useDetail<Role>({
    id: params.id as string,
    title: "roles",
  });

  if (isLoading) {
    return <RoleViewSkeleton />;
  }

  if (!role) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Role not found</h1>
          <p className="text-muted-foreground">
            The role you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  const permissions = env ? JSON.parse(role.permissions) : role.permissions;

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{role.name}</h1>
          <p className="text-muted-foreground">{role.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {role.is_public ? (
            <Badge variant="outline" className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              Public
            </Badge>
          ) : (
            <Badge variant="outline" className="flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Private
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Created By</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{role.created_by?.name || "Unknown"}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Created</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>
                {formatDistanceToNow(new Date(role.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>
                {formatDistanceToNow(new Date(role.updated_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="modules" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>
        <TabsContent value="modules" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Module Access</CardTitle>
              <CardDescription>Modules this role has access to</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries({
                  Bills: role.bills,
                  Clients: role.clients,
                  Currencies: role.currencies,
                  Plans: role.plans,
                  Devices: role.devices,
                  Branches: role.branches,
                  Users: role.users,
                }).map(([module, hasAccess]) => (
                  <div
                    key={module}
                    className="flex items-center p-3 border rounded-md"
                  >
                    {hasAccess ? (
                      <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 mr-2 text-red-500" />
                    )}
                    <span
                      className={
                        hasAccess ? "font-medium" : "text-muted-foreground"
                      }
                    >
                      {module}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="permissions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Permissions</CardTitle>
              <CardDescription>
                Specific permissions for each module
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {Object.entries(permissions).map(
                  ([module, perms]: [string, any]) => (
                    <div key={module} className="border rounded-md p-4">
                      <h3 className="font-medium capitalize mb-2">{module}</h3>
                      <div className="flex flex-wrap gap-2">
                        {perms.map((perm: string) => (
                          <Badge
                            key={perm}
                            variant="secondary"
                            className="capitalize"
                          >
                            {perm}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
