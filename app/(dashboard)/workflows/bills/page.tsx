import { cookies } from "next/headers";
import BillDashboardPageClient from "./client";

export default async function BillDashboardPage() {
  const cookieStore = await cookies();
  const activeTab = cookieStore.get("bills-active-tab")?.value;
  return <BillDashboardPageClient activeTab={activeTab as string} />;
}
