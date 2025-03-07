import { Modal } from "@/components/shared/modal";
import ClientDetail from "../../[id]/page";

function ClientDetailModal({ params }: { params: { id: string } }) {
  return (
    <Modal>
      <ClientDetail params={params} />
    </Modal>
  );
}

export default ClientDetailModal;
