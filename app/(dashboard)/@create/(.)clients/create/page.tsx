import CreateClient from "@/app/(dashboard)/clients/create/page";
import { Modal } from "@/components/shared/modal";

function ClientCreateModal({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <Modal>
      <CreateClient searchParams={searchParams} />
    </Modal>
  );
}

export default ClientCreateModal;
