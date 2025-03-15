import { StateProvider } from "@/app/contexts/state";
import { getUser } from "@/auth/user";
import ExportBtn from "@/components/exports/btn";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TableColumn from "@/models/column";
import { ChartGantt, CircleDollarSign, Plus } from "lucide-react";
import Link from "next/link";
import ListCardNavigation from "../../../components/btn/listcart";
import CreateNewBill from "../choose/createbillbtn";
import BillsClient from "./client";
import ImportDataWithExcelBills from "./import";

async function Bills() {
  const user = await getUser();
  if (!user) return;

  if (!user.super_admin && !user.role?.permissions?.bills?.includes("read")) {
    return null;
  }

  let saveColumns = await TableColumn.findOne({
    where: { user: user.id, title: "bills" },
  });

  return (
    <StateProvider title="bills">
      <div className="p-4 h-auto w-full">
        <div className="flex items-center gap-2 flex-wrap">
          <CreateNewBill />
          {(user.super_admin ||
            user.role?.permissions?.plans?.includes("create")) && (
            <Link
              className={cn(buttonVariants({ variant: "default" }))}
              href={"/workflows/bills/plans/create"}
            >
              <Plus className="w-4" />
              <span className="px-2">Create plan</span>
            </Link>
          )}{" "}
          {(user.super_admin ||
            user.role?.permissions?.currencies?.includes("create")) && (
            <Link
              className={cn(buttonVariants({ variant: "default" }))}
              href={"/workflows/bills/currencies/create"}
            >
              <Plus className="w-4" />
              <span className="px-2">Create currency</span>
            </Link>
          )}
          <Link
            className={cn(buttonVariants({ variant: "default" }))}
            href={"/workflows/bills/plans"}
          >
            <ChartGantt className="w-4" />
            <span className="px-2">Plans</span>
          </Link>
          <Link
            className={cn(buttonVariants({ variant: "default" }))}
            href={"/workflows/bills/currencies"}
          >
            <CircleDollarSign className="w-4" />
            <span className="px-2">Currencies</span>
          </Link>
          <ExportBtn data={JSON.stringify([])} title={"clients"} />
          {user.super_admin && <ImportDataWithExcelBills />}
          <ListCardNavigation />
        </div>
        <BillsClient saveColumns={JSON.stringify(saveColumns)} />
      </div>
    </StateProvider>
  );
}

export default Bills;
