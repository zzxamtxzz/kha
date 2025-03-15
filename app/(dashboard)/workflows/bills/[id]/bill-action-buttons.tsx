import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Bill from "@/models/bill";
import {
  ChevronDown,
  Edit,
  FileText,
  MoreHorizontal,
  Printer,
  Trash2,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CreateBill from "../choose/create-bill";

interface BillActionButtonsProps {
  bill: Bill;
}

export function BillActionButtons({ bill }: BillActionButtonsProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center gap-2">
      {open && (
        <CreateBill
          open={open}
          setOpen={setOpen}
          bill={{ ...bill, edit: bill.id } as unknown as Bill}
        />
      )}
      <Button onClick={() => setOpen(true)} variant="outline" size="sm">
        <Edit className="mr-2 h-4 w-4" />
        Edit
      </Button>

      <Button variant="default" size="sm">
        <CreditCard className="mr-2 h-4 w-4" />
        Record Payment
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>
            <Printer className="mr-2 h-4 w-4" />
            Print Bill
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FileText className="mr-2 h-4 w-4" />
            Export as PDF
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Bill
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Change Status
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Set Status</DropdownMenuLabel>
          <DropdownMenuItem>New</DropdownMenuItem>
          <DropdownMenuItem>In Progress</DropdownMenuItem>
          <DropdownMenuItem>Accepted</DropdownMenuItem>
          <DropdownMenuItem>Approval</DropdownMenuItem>
          <DropdownMenuItem>Closed</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
