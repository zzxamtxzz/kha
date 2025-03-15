import { Modal } from "@/components/shared/modal";
import ClientDetail from "../../[id]/page";

function ClientDetailModal() {
  return (
    <Modal className="w-[700px] p-4 h-auto center card-bg rounded-lg shadow-lg">
      <div className="w-full h-auto">
        <ClientDetail />
      </div>
    </Modal>
  );
}

export default ClientDetailModal;
