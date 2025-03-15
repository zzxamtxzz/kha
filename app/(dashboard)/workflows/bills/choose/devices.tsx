import { Label } from "@/components/ui/label";
import Bill from "@/models/bill";
import Device from "@/models/devices";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import CreateBill from "./create-bill";

function Devices({
  data,
  lastElementRef,
}: {
  data: Device[];
  lastElementRef: any;
}) {
  const [open, setOpen] = useState(false);
  const [device, setDevice] = useState<Device | null>(null);

  return (
    <>
      {device && (
        <CreateBill
          open={open}
          setOpen={setOpen}
          bill={{ device, device_id: device.id } as unknown as Bill}
        />
      )}
      {data.map((device, index) => {
        if (!device) return null;
        return (
          <div
            onClick={() => {
              setDevice(device);
              setOpen(true);
            }}
            className="p-2 hover"
            ref={index === data.length - 1 ? lastElementRef : null}
            key={index}
          >
            <Label>{device.client?.name || device.email}</Label>
            <p className="text-xs">Sn No: {device.snNo}</p>
            <p className="text-xs">Acc No: {device.accNo}</p>
          </div>
        );
      })}
    </>
  );
}

export default Devices;
