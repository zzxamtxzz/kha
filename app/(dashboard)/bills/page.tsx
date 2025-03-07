import { getUser } from "@/auth/user";
import ExportBtn from "@/components/exports/btn";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { ChartGantt, Plus } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import ListCartNavigation from "../_components/btn/listcart";
import CreateNewBill from "./choose/choosedevice";
import BillsClient from "./client";
import ImportDataWithExcelBills from "./import";

async function Bills() {
  const user = await getUser();
  if (!user) return;
  const state = cookies().get("/billsstate")?.value || "";

  const foundRole = roles.find((r) => r.name === user.role);

  return (
    <div className="p-4 h-full w-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <CreateNewBill />
          {(ADMIN === user.role ||
            foundRole?.plans.includes(actions.CREATE)) && (
            <Link
              className={cn(buttonVariants({ variant: "default" }))}
              href={"/bills/plans/create"}
            >
              <Plus className="w-4" />
              <span className="px-2">Create plan</span>
            </Link>
          )}
          <Link
            className={cn(buttonVariants({ variant: "default" }))}
            href={"/bills/plans"}
          >
            <ChartGantt className="w-4" />
            <span className="px-2">Plans</span>
          </Link>
          <ExportBtn data={JSON.stringify([])} title={"clients"} />
          {ADMIN === user.role && <ImportDataWithExcelBills />}
        </div>
        <ListCartNavigation state={state} />{" "}
        <Sheet>
          <div className="fixed z-50 lg:hidden bottom-5 left-2 flex flex-col gap-2">
            <Button
              variant={"outline"}
              className="h-[50px] w-[50px] rounded-full cart-bg"
            >
              + Bill
            </Button>
            <SheetTrigger asChild>
              <Button
                variant={"outline"}
                className="h-[50px] w-[50px] rounded-full cart-bg "
              >
                Tools
              </Button>
            </SheetTrigger>
          </div>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you're done.
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-row gap-2 flex-wrap">
              <ListCartNavigation className="w-full" state={state} />
              <ExportBtn
                className="w-full"
                data={JSON.stringify([])}
                title={"clients"}
              />
              <CreateNewBill className={"w-full"} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <BillsClient state={state} />
    </div>
  );
}

export default Bills;
