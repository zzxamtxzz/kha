import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UserViewSkeleton() {
  return (
    <div className="container mx-auto py-8 max-w-5xl">
      {/* Back to Users link */}
      <div className="mb-6">
        <Skeleton className="h-5 w-28" /> {/* Back link */}
      </div>

      {/* Header with user name, username, badges and action buttons */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-10 w-64 mb-2" /> {/* User name */}
          <Skeleton className="h-5 w-40" /> {/* Username with icon */}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 mr-4">
            <Skeleton className="h-6 w-28" /> {/* Super Admin badge */}
            <Skeleton className="h-6 w-20" /> {/* Active/Inactive badge */}
            <Skeleton className="h-6 w-24" /> {/* Public/Private badge */}
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-36" /> {/* Change Password button */}
            <Skeleton className="h-9 w-20" /> {/* Edit button */}
            <Skeleton className="h-9 w-24" /> {/* Delete button */}
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Email card */}
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-16" /> {/* "Email" title */}
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Skeleton className="h-4 w-4 mr-2 rounded-full" />{" "}
              {/* Email icon */}
              <Skeleton className="h-4 w-48" /> {/* Email address */}
            </div>
          </CardContent>
        </Card>

        {/* Created By card */}
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-24" /> {/* "Created By" title */}
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Skeleton className="h-4 w-4 mr-2 rounded-full" />{" "}
              {/* User icon */}
              <Skeleton className="h-4 w-40" /> {/* Creator name */}
            </div>
          </CardContent>
        </Card>

        {/* Created card */}
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-20" /> {/* "Created" title */}
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Skeleton className="h-4 w-4 mr-2 rounded-full" />{" "}
              {/* Calendar icon */}
              <Skeleton className="h-4 w-40" /> {/* Creation date */}
            </div>
          </CardContent>
        </Card>

        {/* Last Updated card */}
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-28" /> {/* "Last Updated" title */}
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Skeleton className="h-4 w-4 mr-2 rounded-full" />{" "}
              {/* Calendar icon */}
              <Skeleton className="h-4 w-40" /> {/* Update date */}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs section */}
      <div className="w-full">
        <Tabs defaultValue="role" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="role" disabled>
              <Skeleton className="h-5 w-36" /> {/* "Role Information" tab */}
            </TabsTrigger>
            <TabsTrigger value="permissions" disabled>
              <Skeleton className="h-5 w-28" /> {/* "Permissions" tab */}
            </TabsTrigger>
          </TabsList>

          {/* Role tab content */}
          <TabsContent value="role" className="mt-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-7 w-40 mb-2" /> {/* Role name */}
                <Skeleton className="h-5 w-64" /> {/* Role description */}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Module access indicators */}
                  {Array(7)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center p-3 border rounded-md"
                      >
                        <Skeleton className="h-5 w-5 mr-2 rounded-full" />{" "}
                        {/* Check/X icon */}
                        <Skeleton className="h-5 w-24" /> {/* Module name */}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions tab content (hidden in skeleton) */}
          <TabsContent value="permissions" className="hidden">
            {/* Content hidden in skeleton state */}
          </TabsContent>
        </Tabs>
      </div>

      {/* Alternative: Super Admin card (shown conditionally in the real component) */}
      <div className="hidden">
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-48 mb-2" />{" "}
            {/* "Super Administrator" title */}
            <Skeleton className="h-5 w-full max-w-md" /> {/* Description */}
          </CardHeader>
          <CardContent>
            <div className="flex items-center p-4 border rounded-md">
              <Skeleton className="h-6 w-6 mr-3 rounded-full" />{" "}
              {/* Shield icon */}
              <div>
                <Skeleton className="h-5 w-36 mb-2" />{" "}
                {/* "Full System Access" */}
                <Skeleton className="h-4 w-80" /> {/* Description text */}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
