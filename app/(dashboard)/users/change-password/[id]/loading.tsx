import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ChangePasswordSkeleton() {
  return (
    <div className="container mx-auto py-8 max-w-md">
      <Card>
        <CardHeader className="flex-col">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-5 w-5 rounded-full" /> {/* Lock icon */}
            <Skeleton className="h-7 w-40" /> {/* Title */}
          </div>
          <Skeleton className="h-5 w-full max-w-xs" /> {/* Description */}
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Current Password field */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
              <Skeleton className="h-4 w-64" /> {/* Description */}
            </div>

            {/* New Password field */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-28" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
              <Skeleton className="h-4 w-full" /> {/* Description */}
            </div>

            {/* Confirm Password field */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
              <Skeleton className="h-4 w-56" /> {/* Description */}
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Skeleton className="h-10 w-24" /> {/* Cancel button */}
              <Skeleton className="h-10 w-40" /> {/* Change Password button */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
