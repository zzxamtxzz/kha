import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

interface ShowNoTextProps {
  children: ReactNode;
  className?: string;
}

const ShowNoText: FC<ShowNoTextProps> = ({ children, className }) => {
  return <div className={cn("w-full center py-10", className)}>{children}</div>;
};

export default ShowNoText;
