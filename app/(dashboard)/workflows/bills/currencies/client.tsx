"use client";
import { useHasUser } from "@/app/contexts/user";
import { useInfiniteData } from "@/app/hooks/use-infinite-data";
import ShowNoText from "@/components/app/nodata";
import SpinLoading from "@/components/loadings/spinloading";
import { Label } from "@/components/ui/label";
import Currency from "@/models/currency";
import { Edit2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PlansHeaders from "./header";
import RemoveCurrency from "./remove";

function CurrenciesClient() {
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const {
    data: plans,
    loading,
    queryKey,
    count,
    lastElementRef,
  } = useInfiniteData<Currency>({
    keys: "currencies",
    size: 20,
    params: { search },
  });
  const { user } = useHasUser();
  return (
    <div className="p-8 w-[700px]">
      <div className="card-bg p-4 rounded-lg max-w-[700px] mx-auto">
        <PlansHeaders />
        <div className="flex flex-col gap-4">
          {loading && <SpinLoading className="h-24" />}
          {!loading && plans.length <= 0 && (
            <ShowNoText>Nothing found</ShowNoText>
          )}
          {plans.map((plan, index) => {
            return (
              <div key={index} className="p-2">
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
                      <RemoveCurrency plan={plan} queryKey={queryKey} />
                    )}
                  </div>
                </div>
                <p className="text-xs">Name {plan.name}</p>
                <p className="text-xs">Symbol {plan.symbol}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CurrenciesClient;
