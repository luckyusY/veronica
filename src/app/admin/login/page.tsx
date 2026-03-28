import { ShieldCheck } from "lucide-react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

type AdminLoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const callbackUrl =
    typeof resolvedSearchParams.callbackUrl === "string" &&
    resolvedSearchParams.callbackUrl.startsWith("/admin")
      ? resolvedSearchParams.callbackUrl
      : "/admin";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(22rem,0.9fr)]">
      <section className="admin-surface p-6 sm:p-8 lg:p-10">
        <div className="space-y-5">
          <span className="admin-badge">
            <ShieldCheck size={15} />
            <span>Protected workspace</span>
          </span>

          <div>
            <p className="section-label">Veronica Adane Admin</p>
            <h1 className="display-title mt-4 text-5xl text-white sm:text-6xl">
              Sign in to the control room.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-8 text-white/68 sm:text-base">
              Secure access for publishing, media, bookings, commerce, and management
              teams. Every workspace is role-protected and session-limited.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="admin-mini-stat">
              <span className="admin-mini-stat-label">Session window</span>
              <span className="admin-mini-stat-value">8 hours</span>
            </div>
            <div className="admin-mini-stat">
              <span className="admin-mini-stat-label">Access model</span>
              <span className="admin-mini-stat-value">Role based</span>
            </div>
          </div>
        </div>
      </section>

      <section className="admin-surface p-6 sm:p-8 lg:p-10">
        <div className="space-y-5">
          <div>
            <p className="section-label">Credentials</p>
            <h2 className="display-title mt-4 text-4xl text-white">
              Enter your admin account.
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/64">
              Use the email and password assigned to your team role. If you lose
              access, ask the site owner to re-authorize your account.
            </p>
          </div>

          <AdminLoginForm callbackUrl={callbackUrl} />
        </div>
      </section>
    </div>
  );
}
