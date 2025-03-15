import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function CreateUserSkeleton() {
  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="mb-6">
        <Skeleton className="h-5 w-28" /> {/* Back link */}
      </div>

      <Card>
        <CardHeader className="flex-col">
          <Skeleton className="h-7 w-40 mb-2" /> {/* Title */}
          <Skeleton className="h-5 w-full max-w-md" /> {/* Description */}
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              {/* Name field */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-16" /> {/* Label */}
                <Skeleton className="h-10 w-full" /> {/* Input */}
                <Skeleton className="h-4 w-40" /> {/* Description */}
              </div>

              {/* Username and Email fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24" /> {/* Label */}
                  <Skeleton className="h-10 w-full" /> {/* Input */}
                  <Skeleton className="h-4 w-64" /> {/* Description */}
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-16" /> {/* Label */}
                  <Skeleton className="h-10 w-full" /> {/* Input */}
                  <Skeleton className="h-4 w-48" /> {/* Description */}
                </div>
              </div>

              {/* Password fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24" /> {/* Label */}
                  <Skeleton className="h-10 w-full" /> {/* Input */}
                  <Skeleton className="h-4 w-36" /> {/* Description */}
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" /> {/* Label */}
                  <Skeleton className="h-10 w-full" /> {/* Input */}
                  <Skeleton className="h-4 w-56" /> {/* Description */}
                </div>
              </div>

              {/* User Settings section */}
              <div className="border-t pt-4">
                <Skeleton className="h-6 w-36 mb-4" /> {/* Section title */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Super Admin toggle */}
                  <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-28" /> {/* Label */}
                      <Skeleton className="h-4 w-56" /> {/* Description */}
                    </div>
                    <Skeleton className="h-6 w-12 rounded-full" />{" "}
                    {/* Switch */}
                  </div>

                  {/* Role select */}
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-16" /> {/* Label */}
                    <Skeleton className="h-10 w-full" /> {/* Select */}
                    <Skeleton className="h-4 w-64" /> {/* Description */}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {/* Active toggle */}
                  <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-16" /> {/* Label */}
                      <Skeleton className="h-4 w-48" /> {/* Description */}
                    </div>
                    <Skeleton className="h-6 w-12 rounded-full" />{" "}
                    {/* Switch */}
                  </div>

                  {/* Public toggle */}
                  <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-20" /> {/* Label */}
                      <Skeleton className="h-4 w-64" /> {/* Description */}
                    </div>
                    <Skeleton className="h-6 w-12 rounded-full" />{" "}
                    {/* Switch */}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end gap-2">
              <Skeleton className="h-10 w-24" /> {/* Cancel button */}
              <Skeleton className="h-10 w-32" /> {/* Create button */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
