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
import { actions, ADMIN, roles } from "@/roles";
import { ChevronsUpDown, UserRoundPlus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useHasUser } from "../../contexts/user";
import ListCartNavigation from "../_components/btn/listcart";
import SearchInput from "../_components/input/search";
import FilterByClientBtn from "./clients";
import ExportDevicesBtn from "./exports";
import ImportDataWithExcel from "./import";

function DeviceHeader({ state }: { state: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const expired = searchParams.get("expired");
  const { user } = useHasUser();
  const all = (expired: string) => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("expired", expired);
    router.push(`?${currentParams.toString()}`);
  };

  const foundRole = roles.find((r) => r.name === user.name);
  return (
    <div className="flex items-center gap-2 flex-wrap p-2 justify-between">
      <div className="flex gap-2">
        <SearchInput className="lg:w-auto w-full" />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "cart-bg hover justify-start text-left font-normal"
              )}
            >
              <span className="pr-4">
                {expired ? expired + " expires" : "Filter"} devices
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
        {ADMIN === user.role && <FilterByClientBtn />}
      </div>
      <div className="lg:flex hidden gap-2 flex-wrap">
        <ListCartNavigation state={state} />{" "}
        {(ADMIN === user.role ||
          foundRole?.devices.includes(actions.CREATE)) && (
          <Link
            className={cn(
              buttonVariants({
                variant: "default",
                className: "bg-green-500 hover:bg-green-600 w-full sm:w-auto",
              })
            )}
            href={"/devices/create"}
          >
            <UserRoundPlus className="w-4" />
            <span className="px-2">Add New Device</span>
          </Link>
        )}
        <ExportDevicesBtn />
        {ADMIN === user.role && <ImportDataWithExcel />}
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant={"outline"}
            className="z-50 lg:hidden h-[50px] w-[50px] rounded-full cart-bg fixed bottom-5 left-2"
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
            <ListCartNavigation className="w-full" state={state} />
            <Link
              className={cn(
                buttonVariants({
                  variant: "default",
                  className: "bg-green-500 hover:bg-green-600 w-full lg:w-auto",
                })
              )}
              href={"/devices/create"}
            >
              <UserRoundPlus className="w-4" />
              <span className="px-2">Add New Device</span>
            </Link>
            <ExportDevicesBtn />
            {ADMIN === user.role && <ImportDataWithExcel className="w-full" />}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default DeviceHeader;
