import BillDetail from "../../[id]/client";
import { SheetModal } from "@/components/shared/sheet";

function ClientDetailModal() {
  return (
    <SheetModal className={"min-w-[1000px]"}>
      <BillDetail />
    </SheetModal>
  );
}

export default ClientDetailModal;
