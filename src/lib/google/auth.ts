import { auth } from "@googleapis/calendar";

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy .env.example to .env.local and run npm run google:auth.`,
    );
  }
  return value;
}

export function isGoogleConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID?.trim() &&
      process.env.GOOGLE_CLIENT_SECRET?.trim() &&
      process.env.GOOGLE_REFRESH_TOKEN?.trim(),
  );
}

export function getOAuth2Client() {
  const clientId = requireEnv("GOOGLE_CLIENT_ID");
  const clientSecret = requireEnv("GOOGLE_CLIENT_SECRET");
  const refreshToken = requireEnv("GOOGLE_REFRESH_TOKEN");

  const oauth2 = new auth.OAuth2(clientId, clientSecret);
  oauth2.setCredentials({ refresh_token: refreshToken });
  return oauth2;
}
