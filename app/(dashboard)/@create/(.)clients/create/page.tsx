import CreateClient from "@/app/(dashboard)/clients/create/page";
import { Modal } from "@/components/shared/modal";

function ClientCreateModal() {
  return (
    <Modal>
      <div className="p-4 center">
        <CreateClient />
      </div>
    </Modal>
  );
}

export default ClientCreateModal;
