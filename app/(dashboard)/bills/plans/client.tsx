"use client";
import { useInfiniteData } from "@/app/hooks/useInfiniteData";
import ShowNoText from "@/components/app/nodata";
import SpinLoading from "@/components/loadings/spinloading";
import Plan from "@/models/billplan";
import { useSearchParams } from "next/navigation";
import PlansHeaders from "./header";

function BillPlansClient({ state: s }: { state: string }) {
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const state = (searchParams.get("state") || s) as string;
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
  return (
    <div className="p-8 w-[700px]">
      <div className="cart-bg p-4 rounded-lg max-w-[700px] mx-auto">
        <PlansHeaders />
        <div className="flex flex-col gap-4">
          {loading && <SpinLoading className="h-24" />}
          {!loading && plans.length <= 0 && (
            <ShowNoText>Nothing found</ShowNoText>
          )}
          {plans.map((plan, index) => {
            return (
              <div key={index} className="p-2">
                <p className="font-semibold">{plan.name}</p>
                <p>Service Fee {plan.fee}</p>
                <p>Amount In per month {plan.amount}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default BillPlansClient;
