"use client";
import { logout } from "@/app/login/action";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

function Logout() {
  const router = useRouter();
  return (
    <Button
      onClick={async () => {
        await logout();
        router.push("/login");
      }}
      variant={"outline"}
      className="w-full border-none mb-2 p-2 cursor-pointer hover rounded-sm flex items-center"
    >
      <LogOut className="w-6" />
      <span className="px-2">Log out</span>
    </Button>
  );
}

export default Logout;
