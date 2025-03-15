import { useInfiniteData } from "@/app/hooks/use-infinite-data";
import ShowNoText from "@/components/app/nodata";
import SpinLoading from "@/components/loadings/spinloading";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { labelVariants } from "@/components/ui/label";
import useClickOutside from "@/hooks/outside";
import { cn } from "@/lib/utils";
import Device from "@/models/devices";
import { Plus, X } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import CreateDeviceClient from "../../devices/create/form";

function Devices({
  onChange,
  value,
  device,
}: {
  onChange: (value: string) => void;
  value: string;
  device?: Device | null;
}) {
  const [dialog, setDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [choosePlan, setPlan] = useState<Device | null | undefined>(device);
  const [inputValue, setInputValue] = useState("");
  const outSideRef = useRef(null);

  const {
    data: devices,
    queryKey,
    count,
    lastElementRef,
  } = useInfiniteData<Device>({
    keys: "devices",
    size: 20,
    params: { search: inputValue },
  });

  useClickOutside(outSideRef, () => setOpen(false));

  if (loading) return <SpinLoading />;
  return (
    <Dialog open={dialog} onOpenChange={setDialog}>
      <DialogContent className={"w-[700px] h-[95vh] p-4"}>
        <CreateDeviceClient
          onSuccess={() => setDialog(false)}
          defaultValues={{ name: inputValue }}
        />
      </DialogContent>
      <div className="relative">
        {choosePlan ? (
          <div className="card-bg rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <Link
                href={`/workflows/devices/${choosePlan.id}`}
                className={cn(
                  labelVariants({
                    className: "hover:underline text-blue-500 text-xl",
                  })
                )}
              >
                {choosePlan.email}
              </Link>
              <Button
                size={"icon"}
                variant={"outline"}
                className="w-6 h-6"
                onClick={() => setPlan(null)}
              >
                <X className="w-4" />
              </Button>
            </div>
            <p>Device serial {choosePlan.snNo}</p>
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
              onClick={() => setDialog(true)}
            >
              <Plus className="w-4" />
            </Button>
          </div>
        )}
        {open && (
          <div
            ref={outSideRef}
            className="p-1 absolute card-bg w-[600px] h-[200px] overflow-y-auto border z-10 rounded-lg shadow-md"
          >
            {!devices.length && (
              <ShowNoText className="flex flex-col gap-2">
                {loading ? <SpinLoading className="" /> : "Nothing found"}
                {!loading && (
                  <Button type="button" onClick={() => setDialog(true)}>
                    Create Device
                  </Button>
                )}
              </ShowNoText>
            )}
            {devices.map((data, index) => (
              <div
                ref={lastElementRef}
                className="p-2 hover rounded-sm"
                onClick={() => {
                  onChange(data.id);
                  setPlan(data);
                  setOpen(false);
                }}
                key={index}
              >
                {data.client?.name || data.email}
              </div>
            ))}
          </div>
        )}
      </div>
    </Dialog>
  );
}

export default Devices;
