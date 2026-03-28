import { AdminConsole } from "@/components/admin-console";
import { getAdminOperationsData } from "@/lib/admin-screen-data";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const { sections } = await getAdminOperationsData();

  return <AdminConsole collections={["inquiries"]} initialSections={sections} />;
}
