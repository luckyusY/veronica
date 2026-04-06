import { ShieldCheck } from "lucide-react";
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
        {/* Brand */}
        <div className="admin-login-brand">
          <div className="admin-login-monogram">VA</div>
          <div>
            <p className="admin-login-brand-name">Veronica Adane</p>
            <p className="admin-login-brand-sub">Admin Portal</p>
          </div>
        </div>

        <div className="admin-login-divider" />

        {/* Header */}
        <div className="admin-login-header">
          <div className="admin-login-shield">
            <ShieldCheck size={15} />
          </div>
          <h1 className="admin-login-title">Sign in to your workspace</h1>
          <p className="admin-login-desc">
            Enter your credentials to access the admin panel.
          </p>
        </div>

        {/* Form */}
        <AdminLoginForm callbackUrl={callbackUrl} />

        {/* Sample credentials (dev / staging only) */}
        {sampleCredentials.length > 0 ? (
          <div className="admin-login-sample">
            <p className="admin-login-sample-label">Demo accounts</p>
            <div className="admin-login-sample-list">
              {sampleCredentials.map((credential) => (
                <div className="admin-login-sample-row" key={credential.role}>
                  <span className="admin-login-sample-role">{credential.role}</span>
                  <div className="admin-login-sample-creds">
                    <span>{credential.email}</span>
                    <span className="admin-login-sample-sep">·</span>
                    <span>{credential.password}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Footer */}
        <p className="admin-login-footer">
          Sessions active for 8 hours &nbsp;·&nbsp; Role-based access control
        </p>
      </div>
    </div>
  );
}
