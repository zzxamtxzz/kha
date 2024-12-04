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
    icon: <UsersRound size={22} />,
  },
  {
    title: "devices",
    href: "/devices",
    icon: <GalleryVerticalEnd size={22} />,
  },
  // {
  //   title: "professional dashboard",
  //   href: "/professional_dashboard",
  //   icon: <LayoutDashboard size={22} />,
  // },
  {
    title: "bills",
    href: "/bills",
    icon: <CircleDollarSign size={22} />,
  },
];

function List() {
  const pathname = usePathname();
  const { user } = useHasUser();
  const foundRole = roles.find((r) => r.name === user.role);
  return (
    <ul className="h-full hidden sm:flex">
      {routes
        .filter((r) => ADMIN === user.role || (foundRole && foundRole[r.title]))
        .map((route, index) => {
          const active = pathname.startsWith(route.href);
          return (
            <li key={index} className="h-full relative px-2">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Link
                    key={index}
                    className={cn(
                      "h-full rounded-sm center px-8",
                      active ? "text-primary" : "hover"
                    )}
                    href={route.href}
                  >
                    {route.icon}
                    {active && (
                      <div className="w-full h-1 bg-primary absolute bottom-[-4px]"></div>
                    )}
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent className="bg-black opacity-80 text-white w-auto p-2">
                  <p className="capitalize">{route.title}</p>
                </HoverCardContent>
              </HoverCard>
            </li>
          );
        })}
    </ul>
  );
}

export default List;
