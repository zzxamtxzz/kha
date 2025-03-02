import ClientDetail from "@/app/dashboard/clients/[id]/page";
import { Modal } from "@/components/shared/modal";

function ClientDetailModal({ params }: { params: { id: string } }) {
  return (
    <Modal>
      <ClientDetail params={params} />
    </Modal>
  );
}

export default ClientDetailModal;
