type RequiredEnvVar = "MONGODB_URI" | "MONGODB_DB_NAME";

type OptionalEnvVar =
  | "AUTH_SECRET"
  | "ADMIN_OWNER_EMAIL"
  | "ADMIN_OWNER_PASSWORD"
  | "ADMIN_OWNER_NAME"
  | "ADMIN_CONTENT_EMAIL"
  | "ADMIN_CONTENT_PASSWORD"
  | "ADMIN_CONTENT_NAME"
  | "ADMIN_BOOKINGS_EMAIL"
  | "ADMIN_BOOKINGS_PASSWORD"
  | "ADMIN_BOOKINGS_NAME"
  | "ADMIN_MEDIA_EMAIL"
  | "ADMIN_MEDIA_PASSWORD"
  | "ADMIN_MEDIA_NAME"
  | "SHOW_SAMPLE_ADMIN_CREDENTIALS";

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
  ADMIN_CONTENT_EMAIL: getOptionalEnvVar("ADMIN_CONTENT_EMAIL"),
  ADMIN_CONTENT_PASSWORD: getOptionalEnvVar("ADMIN_CONTENT_PASSWORD"),
  ADMIN_CONTENT_NAME: getOptionalEnvVar("ADMIN_CONTENT_NAME"),
  ADMIN_BOOKINGS_EMAIL: getOptionalEnvVar("ADMIN_BOOKINGS_EMAIL"),
  ADMIN_BOOKINGS_PASSWORD: getOptionalEnvVar("ADMIN_BOOKINGS_PASSWORD"),
  ADMIN_BOOKINGS_NAME: getOptionalEnvVar("ADMIN_BOOKINGS_NAME"),
  ADMIN_MEDIA_EMAIL: getOptionalEnvVar("ADMIN_MEDIA_EMAIL"),
  ADMIN_MEDIA_PASSWORD: getOptionalEnvVar("ADMIN_MEDIA_PASSWORD"),
  ADMIN_MEDIA_NAME: getOptionalEnvVar("ADMIN_MEDIA_NAME"),
  SHOW_SAMPLE_ADMIN_CREDENTIALS:
    getOptionalEnvVar("SHOW_SAMPLE_ADMIN_CREDENTIALS") === "true",
  NEXT_PUBLIC_SITE_URL:
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};
