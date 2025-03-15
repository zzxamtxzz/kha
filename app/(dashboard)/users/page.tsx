"use client";
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
import UserType from "@/models/user";
import { formatDistanceToNow } from "date-fns";
import {
  Calendar,
  Edit,
  Eye,
  Globe,
  Loader2,
  Lock,
  Mail,
  Plus,
  Shield,
  Trash2,
  User,
  UserIcon,
} from "lucide-react";
import NextLink from "next/link";
import { useState } from "react";
import UsersListSkeleton from "./loading";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function UsersPage() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const {
    data: users,
    loading,
    queryKey,
    count,
    lastElementRef,
  } = useInfiniteData<UserType>({
    keys: "users",
    size: 20,
    params: { search },
  });

  if (loading) {
    return <UsersListSkeleton />;
  }

  const handleDeleteClick = (user: any) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      setIsDeleting(true);

      // In a real app, you would call an API to delete the user
      // For this example, we'll simulate an API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update the local state to remove the deleted user
      toast({
        title: "User deleted",
        description: `${userToDelete.name} has been deleted successfully.`,
      });
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
      setUserToDelete(null);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">
            Manage system users and their permissions
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
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

                {user.created_by && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      Created by:{" "}
                      <span className="font-medium">
                        {user.created_by.name}
                      </span>
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
              <Link href={`/users/${user.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Eye className="h-4 w-4" />
                  View
                </Button>
              </Link>
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
                onClick={() => handleDeleteClick(user)}
                disabled={user.super_admin} // Prevent deleting super admin users
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="p-4">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this user?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {userToDelete && (
                <>
                  You are about to delete{" "}
                  <span className="font-medium">{userToDelete.name}</span> (
                  {userToDelete.email}
                  ).
                  <br />
                  <br />
                  This action cannot be undone. This will permanently delete the
                  user account and remove all associated data.
                </>
              )}
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
