import CreateBill from "@/app/(dashboard)/bills/create/page";
import { Modal } from "@/components/shared/modal";

function ClientCreateModal({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <Modal>
      <CreateBill searchParams={searchParams} />
    </Modal>
  );
}

export default ClientCreateModal;
