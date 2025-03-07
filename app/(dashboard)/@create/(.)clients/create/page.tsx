import CreateClient from "@/app/(dashboard)/clients/create/page";
import { Modal } from "@/components/shared/modal";

function ClientCreateModal() {
  return (
    <Modal>
      <div className="p-4 w-[700px]">
        <CreateClient />
      </div>
    </Modal>
  );
}

export default ClientCreateModal;
