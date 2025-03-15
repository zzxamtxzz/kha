"use client";

import { useTheme } from "@/app/contexts/theme";
import { useHasUser } from "@/app/contexts/user";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DollarSign,
  Grid,
  History,
  Moon,
  Sun,
  Trash,
  UsersRound
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logout from "./logout";

const sidebarRoutes = [
  {
    name: "clients",
    path: "/workflows/clients",
    icon: <UsersRound className="w-4" />,
  },
  {
    name: "devices",
    path: "/workflows/devices",
    icon: <Grid className="w-4" />,
  },
  { name: "users", path: "/users", icon: <UsersRound className="w-4" /> },
  {
    name: "history",
    path: "/workflows/history",
    icon: <History className="w-4" />,
  },
  {
    name: "trashes",
    path: "/workflows/trashes",
    icon: <Trash className="w-4" />,
  },
  {
    name: "bills",
    path: "/workflows/bills",
    icon: <DollarSign className="w-4" />,
  },
];

function Navigation() {
  const path = usePathname();
  const title = path.split("/")[1];
  const { user } = useHasUser();
  const { theme, toggleTheme } = useTheme();
  const profile = user.profile
    ? ``
    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  return (
    <div className="h-14 p-2 shadow-md flex items-center justify-between card-bg">
      <Label className="text-xl capitalize tracking-wider px-4">{title}</Label>
      <Link href="/" className="font-bold text-lg px-2">
        {/* Limitless Myanmar */}
      </Link>
      <Sheet>
        <div className="flex gap-2 items-center px-4">
          <Button
            size={"icon"}
            variant={"outline"}
            className="border-none w-8 h-8"
            onClick={() => {
              toggleTheme(theme === "light" ? "dark" : "light");
            }}
          >
            {theme === "light" ? (
              <Moon className="w-4" />
            ) : (
              <Sun className="w-4" />
            )}
          </Button>
          <SheetTrigger asChild>
            <Image
              src={profile}
              width={30}
              height={30}
              alt="@profile"
              className="rounded-full cursor-pointer"
            />
          </SheetTrigger>
        </div>
        <SheetContent>
          <Label className="text-lg">{user.name}</Label>
          <ul className="mt-4 flex flex-col">
            {sidebarRoutes
              .filter(
                (r) =>
                  r.title === "workflows" ||
                  user.super_admin ||
                  (user.role && user.role[r.name])
              )
              .map((route, index) => {
                return (
                  <SheetClose asChild key={index}>
                    <Link
                      className="mb-2 p-2 cursor-pointer hover rounded-sm flex items-center"
                      href={route.path}
                    >
                      {route.icon}
                      <span className="px-2">{route.name}</span>
                    </Link>
                  </SheetClose>
                );
              })}
            <Logout />
          </ul>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Navigation;
