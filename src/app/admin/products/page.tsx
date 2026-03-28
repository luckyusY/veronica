import { AdminConsole } from "@/components/admin-console";
import { getAdminOperationsData } from "@/lib/admin-screen-data";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const { sections } = await getAdminOperationsData();

  return <AdminConsole collections={["products"]} initialSections={sections} />;
}
