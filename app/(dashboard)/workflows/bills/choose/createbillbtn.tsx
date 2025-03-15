"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import Devices from "./choosedevices";

function CreateNewBill({ align }: { align?: "center" | "end" | "start" }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Bill
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className="p-0">
        <Devices />
      </PopoverContent>
    </Popover>
  );
}

export default CreateNewBill;
