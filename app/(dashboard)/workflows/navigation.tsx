"use client";
import { useHasUser } from "@/app/contexts/user";
import { cn } from "@/lib/utils";
import {
  Building2,
  CircleDollarSign,
  GalleryVerticalEnd,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
const routes = [
  {
    title: "branches",
    href: "/branches",
    icon: <Building2 size={20} />,
  },
  {
    title: "clients",
    href: "/clients",
    icon: <UsersRound size={20} />,
  },
  {
    title: "devices",
    href: "/devices",
    icon: <GalleryVerticalEnd size={20} />,
  },
  {
    title: "bills",
    href: "/bills",
    icon: <CircleDollarSign size={20} />,
  },
];

function WorkflowNavigation() {
  const { user } = useHasUser();
  const pathname = usePathname();
  return (
    <header className="p-2 h-12">
      <nav className="flex items-center h-full">
        {routes
          .filter((r) => user.super_admin || (user.role && user.role[r.title]))
          .map((route, index) => {
            const active = pathname.includes(route.href);
            return (
              <Link
                className={cn(
                  "h-full px-8 capitalize border-b-2 border-transparent center",
                  active
                    ? "active-color active-color-hover border-blue-500 font-semibold"
                    : "hover"
                )}
                key={index}
                href={`/workflows${route.href}`}
              >
                {route.title}
              </Link>
            );
          })}
      </nav>
    </header>
  );
}

export default WorkflowNavigation;
