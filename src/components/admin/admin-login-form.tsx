"use client";

import { useActionState } from "react";
import { LoaderCircle, LockKeyhole } from "lucide-react";
import { loginAction, type LoginFormState } from "@/app/admin/login/actions";

type AdminLoginFormProps = {
  callbackUrl: string;
};

const initialState: LoginFormState = {
  error: null,
};

function LoginSubmitButton() {
  return (
    <button className="admin-button w-full justify-center" type="submit">
      <LockKeyhole size={15} />
      <span>Enter Admin</span>
    </button>
  );
}

export function AdminLoginForm({ callbackUrl }: AdminLoginFormProps) {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input name="callbackUrl" type="hidden" value={callbackUrl} />

      <div className="admin-field">
        <label htmlFor="admin-email">Email</label>
        <input
          autoComplete="email"
          className="admin-input"
          id="admin-email"
          name="email"
          placeholder="management@veronicaadane.com"
          required
          type="email"
        />
      </div>

      <div className="admin-field">
        <label htmlFor="admin-password">Password</label>
        <input
          autoComplete="current-password"
          className="admin-input"
          id="admin-password"
          name="password"
          placeholder="Enter your password"
          required
          type="password"
        />
      </div>

      {state.error ? (
        <div className="admin-feedback admin-feedback--error">{state.error}</div>
      ) : null}

      {isPending ? (
        <button className="admin-button w-full justify-center" disabled type="submit">
          <LoaderCircle className="animate-spin" size={15} />
          <span>Signing in...</span>
        </button>
      ) : (
        <LoginSubmitButton />
      )}
    </form>
  );
}
