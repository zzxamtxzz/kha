"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlignJustify, Grid2x2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { updateListStateParams } from "./action";

function ListCartNavigation({
  state: s = "list",
  className,
}: {
  state: string | string[] | undefined;
  className?: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentParams = new URLSearchParams(searchParams.toString());
  const state = s || searchParams.get("state");

  const newParams = (param: any) => {
    const params = currentParams;
    params.set("state", param);
    return pathname + "?" + params.toString();
  };

  const key = `${pathname}state`;

  return (
    <div className={cn("items-center", className)}>
      <Link
        onClick={async () => {
          await updateListStateParams(key, "cart");
        }}
        className={cn(
          buttonVariants({
            variant: state === "cart" ? "default" : "outline",
            className: "border rounded-l-lg rounded-r-none",
          })
        )}
        href={newParams("cart")}
      >
        <Grid2x2 className="w-4" />
      </Link>
      <Link
        onClick={async () => {
          await updateListStateParams(key, "list");
        }}
        className={cn(
          buttonVariants({
            variant: state === "list" ? "default" : "outline",
            className: "border rounded-r-lg rounded-l-none",
          })
        )}
        href={newParams("list")}
      >
        <AlignJustify className="w-4" />
      </Link>
    </div>
  );
}

export default ListCartNavigation;
