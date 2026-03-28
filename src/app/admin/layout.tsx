import type { Metadata } from "next";
import { AdminLayoutShell } from "@/components/admin/admin-layout-shell";
import { auth } from "@/lib/auth";
import { isAdminRole } from "@/lib/admin-access";

export const metadata: Metadata = {
  title: "Admin",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const user =
    session?.user?.email &&
    session.user.name &&
    session.user.role &&
    isAdminRole(session.user.role)
      ? {
          email: session.user.email,
          name: session.user.name,
          role: session.user.role,
        }
      : null;

  return <AdminLayoutShell user={user}>{children}</AdminLayoutShell>;
}
