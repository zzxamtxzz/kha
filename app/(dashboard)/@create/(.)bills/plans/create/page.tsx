import CreatePlan from "@/app/(dashboard)/bills/plans/create/page";
import { Modal } from "@/components/shared/modal";

function PlanCreateModal({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <Modal>
      <CreatePlan searchParams={searchParams} />
    </Modal>
  );
}

export default PlanCreateModal;
