"use client";
import { useHasUser } from "@/app/contexts/user";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

function Setting() {
  const { user } = useHasUser();
  return (
    <div className="p-4 flex gap-2">
      {user.super_admin && (
        <Link
          className={cn(buttonVariants({ variant: "outline" }))}
          href={"/settings/roles"}
        >
          Roles
        </Link>
      )}
      <Link
        className={cn(buttonVariants({ variant: "outline" }))}
        href={"/settings/change-password"}
      >
        Change password
      </Link>
    </div>
  );
}

export default Setting;
