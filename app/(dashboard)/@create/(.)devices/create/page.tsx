import CreateDevice from "@/app/(dashboard)/devices/create/page";
import { Modal } from "@/components/shared/modal";

async function CreateDeviceModal({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <Modal>
      <CreateDevice searchParams={searchParams} />
    </Modal>
  );
}

export default CreateDeviceModal;
