import BillPlansClient from "./client";

function BillPlans({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return <BillPlansClient state="" />;
}

export default BillPlans;
