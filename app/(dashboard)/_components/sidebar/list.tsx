"use client";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { ADMIN, roles } from "@/roles";
import {
  CircleDollarSign,
  GalleryVerticalEnd,
  Home,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useHasUser } from "../../../contexts/user";

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

function List() {
  const pathname = usePathname();
  const { user } = useHasUser();
  const foundRole = roles.find((r) => r.name === user.role);
  return (
    <ul className="flex flex-col gap-2 w-full p-2">
      {routes
        .filter((r) => ADMIN === user.role || (foundRole && foundRole[r.title]))
        .map((route, index) => {
          const active = pathname.startsWith(route.href);
          return (
            <Link
              key={index}
              className={cn(
                "h-full rounded-sm flex p-2",
                active ? "text-primary bg-gray-500" : "hover"
              )}
              href={route.href}
            >
              {route.icon}
              <span className="capitalize px-2">{route.title}</span>
              {active && (
                <div className="w-full h-1 bg-primary absolute bottom-[-4px]"></div>
              )}
            </Link>
          );
        })}
    </ul>
  );
}

export default List;
