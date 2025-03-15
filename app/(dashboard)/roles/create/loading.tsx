import { Skeleton } from "@/components/ui/skeleton";
import { modules } from "@/utils/name";

export default function RoleFormSkeleton() {
  return (
    <div className="space-y-4 container mx-auto py-6 max-w-[1000px]">
      {/* Header buttons */}
      <div className="flex items-center justify-end gap-2">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>

      {/* Name field */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-16" /> {/* Label */}
        <Skeleton className="h-10 w-full" /> {/* Input */}
        <Skeleton className="h-4 w-48" /> {/* Description */}
      </div>

      {/* Description field */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-24" /> {/* Label */}
        <Skeleton className="h-24 w-full" /> {/* Textarea */}
        <Skeleton className="h-4 w-64" /> {/* Description */}
      </div>

      {/* Sidebar section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-20" /> {/* Section label */}
          <Skeleton className="h-4 w-80" /> {/* Section description */}
        </div>

        {/* Sidebar checkboxes */}
        <div className="space-y-3">
          {modules.map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <Skeleton className="h-4 w-4 rounded-sm" /> {/* Checkbox */}
              <Skeleton className="h-4 w-24" /> {/* Label */}
            </div>
          ))}
        </div>
      </div>

      {/* Permissions sections */}
      {modules.map((_, index) => (
        <div key={index} className="flex flex-col space-y-4 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" /> {/* Module name */}
              <Skeleton className="h-4 w-64" /> {/* Module description */}
            </div>

            <div className="flex gap-4">
              {/* CRUD checkboxes */}
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-sm" /> {/* Checkbox */}
                    <Skeleton className="h-4 w-16" /> {/* Label */}
                  </div>
                ))}
            </div>
          </div>
        </div>
      ))}

      {/* Footer buttons */}
      <div className="flex items-center justify-end gap-2 pt-4">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
}
