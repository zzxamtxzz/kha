import { useHasUser } from "@/app/contexts/user";
import { useInfiniteData } from "@/app/hooks/use-infinite-data";
import ShowNoText from "@/components/app/nodata";
import SpinLoading from "@/components/loadings/spinloading";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useClickOutside from "@/hooks/outside";
import { cn } from "@/lib/utils";
import Currency from "@/models/currency";
import { Plus, X } from "lucide-react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import CurrencyForm from "../currencies/create/form";

function Currencies({
  onChange,
  value,
  currency,
  setCurrency,
}: {
  onChange: (value: string) => void;
  value: string;
  currency?: Currency;
  setCurrency: Dispatch<SetStateAction<Currency | undefined>>;
}) {
  const [popup, setPopup] = useState(false);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const outSideRef = useRef(null);
  const { loading, data, queryKey, count, lastElementRef } =
    useInfiniteData<Currency>({
      keys: "currencies",
      size: 20,
      params: { search: inputValue },
    });

  const { user } = useHasUser();
  useClickOutside(outSideRef, () => setOpen(false));

  return (
    <Dialog open={popup} onOpenChange={setPopup}>
      <div className="relative">
        {currency ? (
          <div className="card-bg rounded-lg shadow-md p-2">
            <div className="flex items-center justify-between">
              <Label className="text-blue-500 text-sm">
                {currency.name} - {currency.symbol}
              </Label>
              <Button
                size={"icon"}
                variant={"outline"}
                className="w-6 h-6"
                onClick={() => setCurrency(undefined)}
              >
                <X className="w-4" />
              </Button>
            </div>
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
              user.role?.permissions?.currencies?.includes("create")) && (
              <Button
                type="button"
                className="p-0 w-6 h-6 absolute right-1 top-0 bottom-0 my-auto"
                size={"icon"}
                onClick={() => {
                  setPopup(true);
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
            className="p-1 absolute card-bg w-full border z-10 rounded-lg shadow-md"
          >
            {!data.length && (
              <ShowNoText className="flex flex-col gap-2 h-[150px]">
                {loading ? <SpinLoading className="" /> : "Nothing found"}
                {(user.super_admin ||
                  user.role?.permissions?.currencies?.includes("create")) && (
                  <Button type="button" onClick={() => setPopup(true)}>
                    Create Currency
                  </Button>
                )}
              </ShowNoText>
            )}
            {data.map((plan, index) => (
              <div
                className="p-2 hover rounded-sm"
                onClick={() => {
                  onChange(plan.id);
                  setCurrency(plan);
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
      <DialogContent className={cn("w-[700px] p-0")}>
        <CurrencyForm
          onSuccess={(plan) => {
            setPopup(false);
            if (plan) {
              setCurrency(plan);
              onChange(plan.id);
            }
          }}
          defaultValues={{ name: inputValue }}
        />
      </DialogContent>
    </Dialog>
  );
}

export default Currencies;
