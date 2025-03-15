import { useHasUser } from "@/app/contexts/user";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, UserRoundPlus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ListCardNavigation from "../../components/btn/listcard";
import SearchInput from "../../components/input/search";
import ChooseClient from "./clients";
import ExportDevicesBtn from "./exports";
import FilterByBranch from "./filterbranch";
import ImportDataWithExcel from "./import";

function DeviceHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const expired = searchParams.get("expired");
  const { user } = useHasUser();
  const all = (expired: string) => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("expired", expired);
    router.push(`?${currentParams.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap p-2">
      <SearchInput className="lg:w-auto w-full" />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("card-bg hover justify-start text-left font-normal")}
          >
            <span className="pr-4">
              {expired ? expired + " expires" : "filter"} devices
            </span>
            <ChevronsUpDown className="w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[180px] p-0">
          <div className="w-full p-1">
            <p onClick={() => all("")} className="p-2 rounded-sm hover">
              All
            </p>
            <p onClick={() => all("all")} className="p-2 rounded-sm hover">
              Expired Devices
            </p>
            <p onClick={() => all("1")} className="p-2 rounded-sm hover">
              Expire in 1 month
            </p>
            <p onClick={() => all("2")} className="p-2 rounded-sm hover">
              Expire in 2 month
            </p>
            <p onClick={() => all("3")} className="p-2 rounded-sm hover">
              Expire in 3 month
            </p>
          </div>
        </PopoverContent>
      </Popover>
      {user.super_admin && (
        <ChooseClient
          onChange={async (client) => router.push(`?client_id=${client.id}`)}
        />
      )}
      <FilterByBranch
        onChange={(branch) => router.push(`?branch_id=${branch.id}`)}
      />
      <Button
        onClick={() => router.push(pathname)}
        variant={"link"}
        className="text-red-500"
      >
        @clear filter
      </Button>
      <ListCardNavigation />{" "}
      {(user.super_admin ||
        user.role?.permissions?.devices?.includes("create")) && (
        <Link
          className={cn(
            buttonVariants({
              variant: "default",
              className: "bg-green-500 hover:bg-green-600 w-full sm:w-auto",
            })
          )}
          href={"/workflows/devices/create"}
        >
          <UserRoundPlus className="w-4" />
          <span className="px-2">New device</span>
        </Link>
      )}
      <ExportDevicesBtn />
      {user.super_admin && <ImportDataWithExcel />}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant={"outline"}
            className="z-50 lg:hidden h-[50px] w-[50px] rounded-full card-bg fixed bottom-5 left-2"
          >
            Tools
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-row gap-2 flex-wrap">
            <ListCardNavigation className="w-full" />
            <Link
              className={cn(
                buttonVariants({
                  variant: "default",
                  className: "bg-green-500 hover:bg-green-600 w-full lg:w-auto",
                })
              )}
              href={"/workflows/devices/create"}
            >
              <UserRoundPlus className="w-4" />
              <span className="px-2">New device</span>
            </Link>
            <ExportDevicesBtn />
            {user.super_admin && <ImportDataWithExcel className="w-full" />}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default DeviceHeader;
