import type React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { FileText } from "lucide-react";
import Link from "next/link";

interface BillDetailButtonProps extends ButtonProps {
  billId: string;
  useModal?: boolean;
  children?: React.ReactNode;
}

export function BillDetailButton({
  billId,
  useModal = false,
  children,
  ...props
}: BillDetailButtonProps) {
  const href = useModal ? `/bills/${billId}/detail` : `/bills/${billId}`;

  return (
    <Link href={href}>
      <Button variant="outline" size="sm" {...props}>
        <FileText className="mr-2 h-4 w-4" />
        {children || "View Details"}
      </Button>
    </Link>
  );
}
