import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { X } from "lucide-react";

export default function BillFormSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div className="flex flex-col gap-2 w-full h-full mx-auto overflow-y-auto">
      <div className="w-full flex-1 space-y-4">
        <div className="w-full space-y-2 p-2">
          <div className="relative flex items-center justify-between">
            <p className="font-bold text-lg text-center">New Bill</p>
            <Button
              type="button"
              className="w-8 h-8 rounded-full p-0 absolute right-1 top-0"
            >
              <X className="w-4" />
            </Button>
          </div>

          {/* Status field skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Device field skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Plan field skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <Separator />

        <div className="w-full space-y-2 p-2">
          {/* Billing date skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-[240px]" />
          </div>

          {/* Amount and Currency skeletons */}
          <div className="flex items-center gap-2">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Duration and Fee skeletons */}
          <div className="flex items-center gap-2">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Remark skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-24 w-full" />
          </div>

          {/* Branch skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>

      {/* Button skeleton */}
      <div className="flex items-center gap-2 p-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
  );
}
