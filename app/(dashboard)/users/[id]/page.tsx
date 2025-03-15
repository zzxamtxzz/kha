"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Calendar,
  Mail,
  AtSign,
  CheckCircle2,
  XCircle,
  Globe,
  Lock,
  User,
  Edit,
  Trash2,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDetail } from "@/app/hooks/useDetail";
import UserViewSkeleton from "./loading";
import UserType from "@/models/user";

export default function UserViewPage() {
  const params = useParams();
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const {
    data: user,
    isLoading,
    error,
  } = useDetail<UserType>({
    title: "users",
    id: params.id as string,
  });

  if (isLoading) {
    return <UserViewSkeleton />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">User not found</h1>
          <p className="text-muted-foreground">
            The user you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!user) return;

    try {
      setIsDeleting(true);

      // In a real app, you would call an API to delete the user
      // For this example, we'll simulate an API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "User deleted",
        description: `${user.name} has been deleted successfully.`,
      });

      // Redirect to the users list page
      router.push("/users");
    } catch (error: any) {
      toast({
        title: "Error deleting user",
        description:
          error.message || "An error occurred while deleting the user.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  // Parse permissions if user has a role
  const permissions = user.role?.permissions
    ? JSON.parse(user.role.permissions)
    : null;

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="mb-6">
        <Link
          href="/users"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <AtSign className="h-4 w-4" />
            {user.username}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 mr-4">
            {user.super_admin && (
              <Badge className="bg-amber-500 hover:bg-amber-600">
                Super Admin
              </Badge>
            )}
            {user.active ? (
              <Badge
                variant="outline"
                className="border-green-500 text-green-500"
              >
                Active
              </Badge>
            ) : (
              <Badge variant="outline" className="border-red-500 text-red-500">
                Inactive
              </Badge>
            )}
            {user.is_public ? (
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

          <div className="flex items-center gap-2">
            <Link href={`/users/change-password/${user.id}`}>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Lock className="h-4 w-4" />
                Change Password
              </Button>
            </Link>
            <Link href={`/users/edit/${user.id}`}>
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
              onClick={handleDeleteClick}
              disabled={user.super_admin} // Prevent deleting super admin users
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Update the grid of info cards to include created_by */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Email</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
          </CardContent>
        </Card>
        {user.created_by && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Created By</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  {user.created_by.name} ({user.created_by.username})
                </span>
              </div>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Created</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>
                {formatDistanceToNow(new Date(user.created_at), {
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
                {formatDistanceToNow(new Date(user.updated_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {user.role ? (
        <Tabs defaultValue="role" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="role">Role Information</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>
          <TabsContent value="role" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{user.role.name}</CardTitle>
                <CardDescription>{user.role.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries({
                    Bills: user.role.bills,
                    Clients: user.role.clients,
                    Currencies: user.role.currencies,
                    Plans: user.role.plans,
                    Devices: user.role.devices,
                    Branches: user.role.branches,
                    Users: user.role.users,
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
                  {permissions &&
                    Object.entries(permissions).map(
                      ([module, perms]: [string, any]) => (
                        <div key={module} className="border rounded-md p-4">
                          <h3 className="font-medium capitalize mb-2">
                            {module}
                          </h3>
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
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Super Administrator</CardTitle>
            <CardDescription>
              This user has super administrator privileges and is not restricted
              by role permissions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center p-4 border rounded-md bg-amber-50 border-amber-200">
              <Shield className="h-6 w-6 mr-3 text-amber-500" />
              <div>
                <p className="font-medium">Full System Access</p>
                <p className="text-sm text-muted-foreground">
                  Super administrators have unrestricted access to all system
                  features and data.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this user?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to delete{" "}
              <span className="font-medium">{user.name}</span> ({user.email}).
              <br />
              <br />
              This action cannot be undone. This will permanently delete the
              user account and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteConfirm();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete User"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
