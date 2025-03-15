import CreateClient from "@/app/(dashboard)/workflows/clients/create/page";
import { Modal } from "@/components/shared/modal";

function ClientCreateModal() {
  return (
    <Modal>
      <CreateClient />
    </Modal>
  );
}

export default ClientCreateModal;
