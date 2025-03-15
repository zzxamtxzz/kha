"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, getRandomWidth } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useInView } from "react-intersection-observer";

function LastElement({
  count,
  data,
  className,
  custom,
}: {
  count: number;
  data: number;
  className?: string;
  custom?: ReactNode;
}) {
  const { ref, inView } = useInView();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const page = Number(searchParams.get("page") || "1");
  const size = Number(searchParams.get("size") || "10");

  const currentParams = new URLSearchParams(searchParams.toString());

  useEffect(() => {
    if (inView) {
      const url = currentParams;
      url.set("page", `${page + 1}`);
      url.set("size", size.toString());
      if (count > data) router.push(pathname + "?" + url.toString());
    }
  }, [inView, data, page, router, size, count]);

  return (
    <div className={cn("w-full h-auto", className)} ref={ref}>
      {custom || (
        <div className="flex">
          <Skeleton className="w-[48px] h-[48px] rounded-full" />
          <div>
            <Skeleton
              className="h-4 rounded-lg ml-4 mt-1"
              style={{ width: getRandomWidth([100, 150, 120]) }}
            />
            <Skeleton className="h-4 rounded-lg ml-4 mt-1 w-20" />
          </div>
        </div>
      )}
    </div>
  );
}

export default LastElement;
