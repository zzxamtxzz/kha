"use client";
import { cn } from "@/lib/utils";
import { ADMIN, roles } from "@/roles";
import {
  Bell,
  ChevronFirst,
  ChevronLast,
  CircleDollarSign,
  GalleryVerticalEnd,
  Home,
  Settings,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useHasUser } from "@/app/contexts/user";
import { Button } from "@/components/ui/button";

const routes = [
  { title: "home", href: "/home", icon: <Home size={22} /> },
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
  // {
  //   title: "professional dashboard",
  //   href: "/professional_dashboard",
  //   icon: <LayoutDashboard size={22} />,
  // },
  {
    title: "bills",
    href: "/bills",
    icon: <CircleDollarSign size={20} />,
  },
];

function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useHasUser();
  const foundRole = roles.find((r) => r.name === user.role);

  return (
    <aside className="h-full cart-bg pt-2 border-r flex flex-col justify-between">
      <div>
        <div className="my-8 center">
          <div
            onClick={() => router.push("/")}
            className="font-semibold text-lg"
          >
            S
            {/* <span
              className={cn(
                "overflow-hidden transition-all",
                expanded ? "w-52 ml-3" : "w-0"
              )}
            >
              APIH
            </span> */}
          </div>
        </div>
        <ul className="flex flex-col gap-2 w-full p-2">
          {routes
            .filter(
              (r) => ADMIN === user.role || (foundRole && foundRole[r.title])
            )
            .map((route, index) => {
              const active = pathname.startsWith(route.href);
              return (
                <Link
                  key={index}
                  className={cn(
                    "h-full rounded-sm flex p-2",
                    active ? "active-color active-color-hover" : "hover"
                  )}
                  href={route.href}
                >
                  {route.icon}
                  <span
                    className={cn(
                      "overflow-hidden transition-all",
                      expanded ? "w-52 ml-3" : "w-0"
                    )}
                  >
                    {route.title}
                  </span>
                  {active && (
                    <div className="w-full h-1 bg-primary absolute bottom-[-4px]"></div>
                  )}
                </Link>
              );
            })}
        </ul>
      </div>
      <div
        className={cn(
          "flex p-2 gap-2 items-center",
          expanded ? "flex-row" : "flex-col"
        )}
      >
        <Button size={"icon"} variant={"outline"}>
          <Settings className="w-4" />
        </Button>
        <Button size={"icon"} variant={"outline"}>
          <Bell className="w-4" />
        </Button>
        <Button
          onClick={() => setExpanded(!expanded)}
          size={"icon"}
          variant={"outline"}
          className="ml-auto"
        >
          {expanded ? (
            <ChevronFirst className="w-4" />
          ) : (
            <ChevronLast className="w-4" />
          )}
        </Button>
      </div>
    </aside>
  );
}

export default Sidebar;
