import { useHasUser } from "@/app/contexts/user";
import { useInfiniteData } from "@/app/hooks/use-infinite-data";
import ShowNoText from "@/components/app/nodata";
import SpinLoading from "@/components/loadings/spinloading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import useClickOutside from "@/hooks/outside";
import Plan from "@/models/plan";
import { Plus, X } from "lucide-react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import PlanForm from "../plans/create/client";

function Plans({
  onChange,
  value,
  plan,
  setPlan,
}: {
  onChange: (value: string) => void;
  value: string;
  plan?: Plan;
  setPlan: Dispatch<SetStateAction<Plan | undefined>>;
}) {
  const [open, setOpen] = useState(false);
  const [sheet, setSheet] = useState(false);
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
  const { user } = useHasUser();

  useClickOutside(outSideRef, () => setOpen(false));

  return (
    <Sheet open={sheet} onOpenChange={setSheet}>
      <div className="relative">
        {plan ? (
          <div className="card-bg rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <Label className="text-blue-500 text-lg">{plan.name}</Label>
              <Button
                size={"icon"}
                variant={"outline"}
                className="w-6 h-6"
                onClick={() => setPlan(undefined)}
              >
                <X className="w-4" />
              </Button>
            </div>
            <p>{plan.amount}</p>
          </div>
        ) : (
          <div className="relative w-full">
            <Input
              onFocus={() => setOpen(true)}
              placeholder="Enter the name"
              className="flex-1"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
            />
            {(user.super_admin ||
              user.role?.permissions?.plans?.includes("create")) && (
              <Button
                type="button"
                className="p-0 w-6 h-6 absolute right-1 top-0 bottom-0 my-auto"
                size={"icon"}
                onClick={() => {
                  setSheet(true);
                }}
              >
                <Plus className="w-4" />
              </Button>
            )}
          </div>
        )}
        {open && (
          <div
            ref={outSideRef}
            className="p-1 absolute card-bg w-[600px] border z-10 rounded-lg shadow-md"
          >
            {!plans.length && (
              <ShowNoText className="flex flex-col gap-2 h-[150px]">
                {loading ? <SpinLoading className="" /> : "Nothing found"}
                {(user.super_admin ||
                  user.role?.permissions?.plans?.includes("create")) && (
                  <Button type="button" onClick={() => setSheet(true)}>
                    Create Plan
                  </Button>
                )}
              </ShowNoText>
            )}
            {plans.map((plan, index) => (
              <div
                className="p-2 hover rounded-sm"
                onClick={() => {
                  onChange(plan.id);
                  setPlan(plan);
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
      <SheetContent className={"p-0"}>
        <PlanForm
          onSuccess={(plan) => {
            setSheet(false);
            if (plan) {
              setPlan(plan);
              onChange(plan.id);
            }
          }}
          defaultValues={{ name: inputValue }}
        />
      </SheetContent>
    </Sheet>
  );
}

export default Plans;
