"use client";
import { useViewMode } from "@/app/contexts/state";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlignJustify, Grid2x2 } from "lucide-react";

function ListCardNavigation({ className }: { className?: string }) {
  const { state, setState } = useViewMode();

  const card = state === "card";
  const list = state === "list";
  return (
    <div className={cn("items-center flex", className)}>
      <Button
        className="rounded-r-none"
        size={"icon"}
        variant={card ? "default" : "outline"}
        onClick={() => setState("card")}
      >
        <Grid2x2 className="w-4" />
      </Button>
      <Button
        className="rounded-l-none"
        size={"icon"}
        variant={list ? "default" : "outline"}
        onClick={() => setState("list")}
      >
        <AlignJustify className="w-4" />
      </Button>
    </div>
  );
}

export default ListCardNavigation;
