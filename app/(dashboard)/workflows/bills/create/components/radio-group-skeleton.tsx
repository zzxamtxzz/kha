import { Skeleton } from "@/components/ui/skeleton";

interface RadioGroupSkeletonProps {
  count?: number;
}

export default function RadioGroupSkeleton({
  count = 5,
}: RadioGroupSkeletonProps) {
  return (
    <div className="flex flex-col space-y-3 px-4">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="flex items-center space-x-3">
            <Skeleton className="h-4 w-4 rounded-full" /> {/* Radio button */}
            <Skeleton className="h-4 w-40" /> {/* Label */}
          </div>
        ))}
    </div>
  );
}
