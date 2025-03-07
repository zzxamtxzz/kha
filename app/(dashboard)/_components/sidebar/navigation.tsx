"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { History, Moon, Radio, Sun, Trash, UsersRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Logout from "./logout";
import { useHasUser } from "@/app/contexts/user";
import { useTheme } from "@/app/contexts/theme";

const sidebarRoutes = [
  { name: "clients", path: "/clients", icon: <UsersRound className="w-4" /> },
  { name: "devices", path: "/devices", icon: <Radio className="w-4" /> },
  { name: "users", path: "/users", icon: <UsersRound className="w-4" /> },
  { name: "history", path: "/history", icon: <History className="w-4" /> },
  { name: "trashes", path: "/trashes", icon: <Trash className="w-4" /> },
];

function Navigation() {
  const { user } = useHasUser();
  const { theme, toggleTheme } = useTheme();
  const profile = user.profile
    ? ``
    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  return (
    <div className="h-14 p-1 shadow-md flex items-center justify-between cart-bg">
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
              className="rounded-full"
            />
          </SheetTrigger>
        </div>
        <SheetContent>
          <ul className="mt-4 flex flex-col">
            {sidebarRoutes.map((route, index) => {
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
