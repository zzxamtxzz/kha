import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

function SpinLoading({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("z-60 h-full w-full center", className)}>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      {children}
    </div>
  );
}

export default SpinLoading;
