import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function UsersListSkeleton() {
  return (
    <div className="container mx-auto py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-9 w-32 mb-2" /> {/* "Users" title */}
          <Skeleton className="h-5 w-64" /> {/* Subtitle */}
        </div>
        <Skeleton className="h-10 w-28" /> {/* "Add User" button */}
      </div>

      {/* User cards */}
      <div className="grid grid-cols-1 gap-6">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between w-full">
                  <div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-40" /> {/* User name */}
                      {index === 0 && <Skeleton className="h-5 w-28" />}{" "}
                      {/* Super Admin badge (first user only) */}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Skeleton className="h-3 w-3 rounded-full" />{" "}
                      {/* Email icon */}
                      <Skeleton className="h-4 w-48" /> {/* Email */}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-20" />{" "}
                    {/* Active/Inactive badge */}
                    <Skeleton className="h-6 w-20" />{" "}
                    {/* Public/Private badge */}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2 rounded-full" />{" "}
                    {/* User icon */}
                    <Skeleton className="h-4 w-40" /> {/* Username */}
                  </div>

                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2 rounded-full" />{" "}
                    {/* Shield icon */}
                    <Skeleton className="h-4 w-48" />{" "}
                    {/* Role or Super Admin text */}
                  </div>

                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2 rounded-full" />{" "}
                    {/* User icon */}
                    <Skeleton className="h-4 w-48" /> {/* Created by */}
                  </div>

                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2 rounded-full" />{" "}
                    {/* Calendar icon */}
                    <Skeleton className="h-4 w-56" /> {/* Created date */}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Skeleton className="h-9 w-20" /> {/* View button */}
                <Skeleton className="h-9 w-20" /> {/* Edit button */}
                <Skeleton className="h-9 w-20" /> {/* Delete button */}
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
}
