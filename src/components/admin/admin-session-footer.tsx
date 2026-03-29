"use client";

import { type AdminRole, adminRoleLabels } from "@/lib/admin-access";
import { logoutAction } from "@/lib/auth-actions";

type AdminSessionFooterProps = {
  email: string;
  name: string;
  role: AdminRole;
};

function SubmitButton() {
  return (
    <button className="admin-session-signout" type="submit">
      Sign out
    </button>
  );
}

export function AdminSessionFooter({
  email,
  name,
  role,
}: AdminSessionFooterProps) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="admin-session-card">
      <div className="admin-session-header">
        <div className="admin-session-avatar">{initials || "VA"}</div>
        <div>
          <p className="admin-session-name">{name}</p>
          <p className="admin-session-role">{adminRoleLabels[role]}</p>
          <p className="admin-session-email">{email}</p>
        </div>
      </div>

      <form action={logoutAction}>
        <SubmitButton />
      </form>
    </div>
  );
}
