"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";

export type LoginFormState = {
  error: string | null;
};

function sanitizeCallbackUrl(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return "/admin";
  }

  const nextValue = value.trim();
  return nextValue.startsWith("/admin") ? nextValue : "/admin";
}

export async function loginAction(
  _previousState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const email =
    typeof formData.get("email") === "string"
      ? formData.get("email")?.toString().trim() ?? ""
      : "";
  const password =
    typeof formData.get("password") === "string"
      ? formData.get("password")?.toString() ?? ""
      : "";
  const callbackUrl = sanitizeCallbackUrl(formData.get("callbackUrl"));

  if (!email || !password) {
    return {
      error: "Email and password are required.",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });

    return {
      error: null,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error:
          error.type === "CredentialsSignin"
            ? "Invalid email or password."
            : "Unable to sign in right now.",
      };
    }

    throw error;
  }
}
