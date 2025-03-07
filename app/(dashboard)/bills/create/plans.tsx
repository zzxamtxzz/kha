import { useInfiniteData } from "@/app/hooks/useInfiniteData";
import ShowNoText from "@/components/app/nodata";
import { Button } from "@/components/ui/button";
import useClickOutside from "@/hooks/outside";
import Plan from "@/models/billplan";
import { Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import CreatePlanClient from "../plans/create/form";
import SpinLoading from "@/components/loadings/spinloading";
import { Label } from "@/components/ui/label";
import { usePopup } from "@/app/contexts/dialog";

function Plans({
  onChange,
  value,
  plan,
}: {
  onChange: (value: string) => void;
  value: string;
  plan?: Plan;
}) {
  const [open, setOpen] = useState(false);
  const [choosePlan, setChoosePlan] = useState<Plan | null>(plan);
  const [inputValue, setInputValue] = useState("");
  const outSideRef = useRef(null);
  const {
    loading,
    data: plans,
    queryKey,
    count,
    lastElementRef,
  } = useInfiniteData<Plan>({
    keys: "plans",
    size: 20,
    params: { search: inputValue },
  });

  const { setPopup, closeDialog } = usePopup();
  useClickOutside(outSideRef, () => setOpen(false));
  const openPlan = () => {
    setPopup({
      title: "Create plan",
      children: (
        <CreatePlanClient
          onSuccess={(plan) => {
            closeDialog();
            if (plan) {
              setChoosePlan(plan);
              onChange(plan.id);
            }
          }}
          defaultValues={{ name: inputValue }}
        />
      ),
    });
  };
  return (
    <div className="relative">
      {choosePlan ? (
        <div className="cart-bg rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <Label className="text-blue-500 text-lg">{choosePlan.name}</Label>
            <Button
              size={"icon"}
              variant={"outline"}
              className="w-6 h-6"
              onClick={() => setChoosePlan(null)}
            >
              <X className="w-4" />
            </Button>
          </div>
          <p>{choosePlan.amount}</p>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full border rounded-md p-1 pl-2">
          <input
            onFocus={() => setOpen(true)}
            placeholder="Enter the name"
            className="flex-1"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
          <Button
            type="button"
            className="p-1"
            size={"icon"}
            onClick={openPlan}
          >
            <Plus className="w-4" />
          </Button>
        </div>
      )}
      {open && (
        <div
          ref={outSideRef}
          className="p-1 absolute cart-bg w-[600px] h-[150px] border z-10 rounded-lg shadow-md"
        >
          {!plans.length && (
            <ShowNoText className="flex flex-col gap-2">
              {loading ? <SpinLoading className="" /> : "Nothing found"}
              <Button type="button" onClick={openPlan}>
                Create Plan
              </Button>
            </ShowNoText>
          )}
          {plans.map((plan, index) => (
            <div
              className="p-2 hover rounded-sm"
              onClick={() => {
                onChange(plan.id);
                setChoosePlan(plan);
                setOpen(false);
              }}
              key={index}
            >
              {plan.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Plans;
