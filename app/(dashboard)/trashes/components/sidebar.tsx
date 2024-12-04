"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

function TrashesSidebar() {
  const pathname = usePathname();
  return (
    <div className="w-[300px] h-full">
      <div className="flex flex-col gap-1 p-2">
        {[
          { name: "clients", path: "/trashes/clients" },
          { name: "devices", path: "/trashes/devices" },
          { name: "bills", path: "/trashes/bills" },
          { name: "users", path: "/trashes/users" },
        ].map((route, index) => {
          const active = pathname === route.path;
          return (
            <Link
              href={route.path}
              key={index}
              className={cn(
                "w-full p-3 hover capitalize font-[500] rounded-lg",
                active && "active-color font-semibold"
              )}
            >
              {route.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default TrashesSidebar;
