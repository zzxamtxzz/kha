import { Skeleton } from "@/components/ui/skeleton";

export function DeviceStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="h-[104px] rounded-md border bg-card text-card-foreground shadow-sm"
          >
            <div className="p-6 flex flex-col space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
    </div>
  );
}
