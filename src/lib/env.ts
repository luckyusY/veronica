type RequiredEnvVar = "MONGODB_URI" | "MONGODB_DB_NAME";

type OptionalEnvVar =
  | "AUTH_SECRET"
  | "ADMIN_OWNER_EMAIL"
  | "ADMIN_OWNER_PASSWORD"
  | "ADMIN_OWNER_NAME";

function getEnvVar(name: RequiredEnvVar) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

function getOptionalEnvVar(name: OptionalEnvVar) {
  const value = process.env[name];

  if (!value) {
    return undefined;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

export const env = {
  MONGODB_URI: getEnvVar("MONGODB_URI"),
  MONGODB_DB_NAME: getEnvVar("MONGODB_DB_NAME"),
  AUTH_SECRET:
    getOptionalEnvVar("AUTH_SECRET") ??
    (process.env.NODE_ENV === "development"
      ? "veronica-local-auth-secret"
      : undefined),
  ADMIN_OWNER_EMAIL: getOptionalEnvVar("ADMIN_OWNER_EMAIL"),
  ADMIN_OWNER_PASSWORD: getOptionalEnvVar("ADMIN_OWNER_PASSWORD"),
  ADMIN_OWNER_NAME: getOptionalEnvVar("ADMIN_OWNER_NAME"),
  NEXT_PUBLIC_SITE_URL:
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};
