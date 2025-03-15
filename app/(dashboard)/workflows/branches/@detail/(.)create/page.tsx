import { Modal } from "@/components/shared/modal";
import CreateBranch from "../../create/page";

async function CreateBranchModal() {
  return (
    <Modal>
      <CreateBranch className="h-full w-[400px] center p-4" />
    </Modal>
  );
}

export default CreateBranchModal;
