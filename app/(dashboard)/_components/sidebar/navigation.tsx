import { getUser } from "@/auth/user";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronDown, History, Radio, Trash, UsersRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import List from "./list";
import Logout from "./logout";

const sidebarRoutes = [
  { name: "clients", path: "/clients", icon: <UsersRound className="w-4" /> },
  { name: "devices", path: "/devices", icon: <Radio className="w-4" /> },
  { name: "users", path: "/users", icon: <UsersRound className="w-4" /> },
  { name: "history", path: "/history", icon: <History className="w-4" /> },
  { name: "trashes", path: "/trashes", icon: <Trash className="w-4" /> },
];

async function Navigation() {
  const user = await getUser();
  if (!user) return;
  const profile = user.profile
    ? ``
    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  return (
    <div className="h-14 p-1 shadow-sm flex items-center justify-between cart-bg">
      <Link href="/" className="font-bold text-lg px-2">
        {/* Limitless Myanmar */}
      </Link>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant={"outline"}
            className="relative rounded-lg w-auto h-auto p-1"
          >
            <Image
              src={profile}
              width={40}
              height={40}
              alt="@profile"
              className="rounded-full"
            />
            <p className="font-semibold px-2">{user.name}</p>
            <ChevronDown className="w-4 bottom-0 right-0" />
          </Button>
        </SheetTrigger>
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
