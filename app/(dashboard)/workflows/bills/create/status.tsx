import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { groups } from "@/data/statuses";
import Bill from "@/models/bill";
import { useState } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import Statuses from "./statuses";

function StatusField({
  bill,
  onChange,
}: {
  bill: Bill;
  onChange: (value: string) => void;
}) {
  const [status, setStatus] = useState(bill.status);
  const [open, setOpen] = useState(false);

  const groupColor = groups.find((g) => g.id === status?.group)?.color;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          style={{
            backgroundColor: groupColor,
            color: groupColor && "#fff",
          }}
          className="cursor-pointer inline-flex items-center capitalize h-6 rounded-sm border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <span className="pr-2">{status?.name}</span>
          {open ? <AiFillCaretUp /> : <AiFillCaretDown />}
        </div>
      </PopoverTrigger>
      <PopoverContent align={"start"} className="w-56 p-0 flex flex-col gap-1">
        <Label className="p-1">Choose Status</Label>
        <Separator />
        <Statuses
          bill={bill}
          setOpen={setOpen}
          setStatus={setStatus}
          onChange={onChange}
        />
      </PopoverContent>
    </Popover>
  );
}

export default StatusField;
