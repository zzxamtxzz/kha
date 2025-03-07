import { useInfiniteData } from "@/app/hooks/useInfiniteData";
import ShowNoText from "@/components/app/nodata";
import { Button } from "@/components/ui/button";
import useClickOutside from "@/hooks/outside";
import { Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import SpinLoading from "@/components/loadings/spinloading";
import { Label } from "@/components/ui/label";
import Device from "@/models/devices";
import { usePopup } from "@/app/contexts/dialog";
import CreateDeviceClient from "../../devices/create/form";

function Devices({
  onChange,
  value,
  device,
}: {
  onChange: (value: string) => void;
  value: string;
  device?: Device;
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [choosePlan, setChoosePlan] = useState<Device | null>(device);
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

  const { setPopup, closeDialog } = usePopup();
  useClickOutside(outSideRef, () => setOpen(false));
  const openPlan = () => {
    setPopup({
      title: "New plan",
      children: (
        <CreateDeviceClient
          onSuccess={closeDialog}
          defaultValues={{ name: inputValue }}
        />
      ),
    });
  };
  if (loading) return <SpinLoading />;
  return (
    <div className="relative">
      {choosePlan ? (
        <div className="cart-bg rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <Label className="text-blue-500 text-lg">{choosePlan.email}</Label>
            <Button
              size={"icon"}
              variant={"outline"}
              className="w-6 h-6"
              onClick={() => setChoosePlan(null)}
            >
              <X className="w-4" />
            </Button>
          </div>
          <p>Device serial {choosePlan.device_serial}</p>
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
          className="p-1 absolute cart-bg w-[600px] h-[200px] overflow-y-auto border z-10 rounded-lg shadow-md"
        >
          {!devices.length && (
            <ShowNoText className="flex flex-col gap-2">
              {loading ? <SpinLoading className="" /> : "Nothing found"}
              <Button type="button" onClick={openPlan}>
                Create Device
              </Button>
            </ShowNoText>
          )}
          {devices.map((data, index) => (
            <div
              ref={lastElementRef}
              className="p-2 hover rounded-sm"
              onClick={() => {
                onChange(data.id);
                setChoosePlan(data);
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
  );
}

export default Devices;
