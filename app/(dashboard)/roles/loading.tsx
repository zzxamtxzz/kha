import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function RolesListSkeleton() {
  return (
    <div className="container mx-auto py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-9 w-32 mb-2" /> {/* Title */}
          <Skeleton className="h-5 w-64" /> {/* Subtitle */}
        </div>
        <Skeleton className="h-10 w-28" /> {/* Add Role button */}
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-1 gap-6">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-40" /> {/* Role name */}
                    <Skeleton className="h-4 w-64" /> {/* Role description */}
                  </div>
                  <Skeleton className="h-6 w-20" /> {/* Badge */}
                </div>
              </CardHeader>
              <CardContent>
                {/* Module access indicators */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                  {Array(7)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />{" "}
                        {/* Icon */}
                        <Skeleton className="h-4 w-20" /> {/* Module name */}
                      </div>
                    ))}
                </div>
                <Skeleton className="h-4 w-56 mt-4" /> {/* Created info */}
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
