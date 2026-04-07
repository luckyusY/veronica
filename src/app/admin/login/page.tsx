import { ShieldCheck } from "lucide-react";
import Image from "next/image";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { getSampleAdminCredentials } from "@/lib/db/users";

type AdminLoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const sampleCredentials = getSampleAdminCredentials();
  const callbackUrl =
    typeof resolvedSearchParams.callbackUrl === "string" &&
    resolvedSearchParams.callbackUrl.startsWith("/admin")
      ? resolvedSearchParams.callbackUrl
      : "/admin";

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <div className="admin-login-monogram" style={{ background: 'transparent', border: 'none', padding: 0 }}>
            <Image src="/logo.png" alt="VA" width={110} height={24} style={{ objectFit: 'contain' }} />
          </div>
          <div>
            <p className="admin-login-brand-name">Veronica Adane</p>
            <p className="admin-login-brand-sub">Admin Portal</p>
          </div>
        </div>

        <div className="admin-login-divider" />

        <div className="admin-login-header">
          <div className="admin-login-shield">
            <ShieldCheck size={15} />
          </div>
          <h1 className="admin-login-title">Sign in to the control room</h1>
          <p className="admin-login-desc">
            Enter your credentials to manage content, media, releases, and operations.
          </p>
        </div>

        <AdminLoginForm callbackUrl={callbackUrl} />

        {sampleCredentials.length > 0 ? (
          <div className="admin-login-sample">
            <p className="admin-login-sample-label">Demo accounts</p>
            <div className="admin-login-sample-list">
              {sampleCredentials.map((credential) => (
                <div className="admin-login-sample-row" key={credential.role}>
                  <span className="admin-login-sample-role">{credential.role}</span>
                  <div className="admin-login-sample-creds">
                    <span>{credential.email}</span>
                    <span className="admin-login-sample-sep">&middot;</span>
                    <span>{credential.password}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <p className="admin-login-footer">
          Sessions active for 8 hours &nbsp;&middot;&nbsp; Role-based access control
        </p>
      </div>
    </div>
  );
}
