"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CirclePlus } from "lucide-react";
import Devices from "./devices";

function CreateNewBill({ className }: { className?: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className={className}>
          <span className="px-2">Create bill</span>
          <CirclePlus className="w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 mx-2">
        <Devices />
      </PopoverContent>
    </Popover>
  );
}

export default CreateNewBill;
