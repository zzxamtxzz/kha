"use client";
import { useHasUser } from "@/app/contexts/user";
import { useInfiniteData } from "@/app/hooks/use-infinite-data";
import ShowNoText from "@/components/app/nodata";
import SpinLoading from "@/components/loadings/spinloading";
import { Label } from "@/components/ui/label";
import Plan from "@/models/plan";
import { Edit2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PlansHeaders from "./header";
import RemovePlan from "./remove";

function BillPlansClient({ showHeader = true }: { showHeader?: boolean }) {
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const {
    data: plans,
    loading,
    queryKey,
    count,
    lastElementRef,
  } = useInfiniteData<Plan>({
    keys: "plans",
    size: 20,
    params: { search },
  });
  const { user } = useHasUser();

  return (
    <div className="card-bg rounded-lg w-[700px] mx-auto h-auto">
      {showHeader && <PlansHeaders />}
      <div className="flex flex-col gap-4 h-[calc(100%-48px)] overflow-y-auto">
        {loading && <SpinLoading className="h-24" />}
        {!loading && plans.length <= 0 && (
          <ShowNoText>Nothing found</ShowNoText>
        )}
        {plans.map((plan, index) => {
          return (
            <div key={index} className="p-2 border-b">
              <div className="flex items-center justify-between">
                <Label className="font-semibold">{plan.name}</Label>
                <div className="flex items-center gap-1">
                  {(user.super_admin ||
                    user.role?.permissions?.plans?.includes("update")) && (
                    <Link
                      href={`/workflows/bills/plans/create?edit=${plan.id}`}
                      className="w-6 h-6 border center rounded-md"
                    >
                      <Edit2 className="w-4" />
                    </Link>
                  )}{" "}
                  {(user.super_admin ||
                    user.role?.permissions?.plans?.includes("delete")) && (
                    <RemovePlan plan={plan} queryKey={queryKey} />
                  )}
                </div>
              </div>
              <p className="text-xs">
                Service Fee {plan.fee} {plan.currency?.symbol}
              </p>
              <p className="text-xs">
                Amount In per month {plan.amount} {plan.currency?.symbol}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BillPlansClient;
