/**
 * One-time OAuth setup for the STUDIO Google account.
 * Covers Calendar booking + contact form email (Gmail send).
 * Website visitors never sign in to Google.
 *
 * Prerequisites:
 * 1. Google Cloud Console → create/select a project
 * 2. Enable "Google Calendar API" and "Gmail API"
 * 3. Configure OAuth consent screen (External, add kalmtouch18@gmail.com as test user)
 * 4. Create OAuth client ID → Application type: "Web application"
 * 5. Add redirect URI: http://localhost:3333/oauth2callback
 * 6. Copy client id + secret into .env.local
 *
 * Then run: npm run google:auth
 * Sign in once as kalmtouch18@gmail.com and paste the refresh token into .env.local
 */
import { createServer } from "node:http";
import { parse } from "node:url";
import { auth } from "@googleapis/calendar";
import { config } from "dotenv";

config({ path: ".env.local" });
config(); // fallback .env

const PORT = 3333;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/gmail.send",
];

async function main() {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

  if (!clientId || !clientSecret) {
    console.error(`
Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET.

1. Copy .env.example → .env.local
2. Create a Web application OAuth client in Google Cloud Console
3. Paste the client id + secret into .env.local
4. Add this Authorized redirect URI on the OAuth client:
   ${REDIRECT_URI}
`);
    process.exit(1);
  }

  const oauth2 = new auth.OAuth2(clientId, clientSecret, REDIRECT_URI);
  const authorizeUrl = oauth2.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });

  const tokenPromise = new Promise<string>((resolve, reject) => {
    const server = createServer(async (req, res) => {
      try {
        if (!req.url?.startsWith("/oauth2callback")) {
          res.writeHead(404);
          res.end("Not found");
          return;
        }

        const query = parse(req.url, true).query;
        if (query.error) {
          res.writeHead(400, { "Content-Type": "text/html" });
          res.end(`<h1>Auth failed</h1><p>${query.error}</p>`);
          reject(new Error(String(query.error)));
          server.close();
          return;
        }

        const code = String(query.code || "");
        const { tokens } = await oauth2.getToken(code);
        oauth2.setCredentials(tokens);

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(
          "<h1>KalmTouch connected</h1><p>You can close this tab and return to the terminal.</p>",
        );

        server.close();

        if (!tokens.refresh_token) {
          reject(
            new Error(
              "No refresh_token returned. Revoke app access at https://myaccount.google.com/permissions and try again with prompt=consent.",
            ),
          );
          return;
        }

        resolve(tokens.refresh_token);
      } catch (error) {
        reject(error);
        server.close();
      }
    });

    server.listen(PORT, () => {
      console.log(`
Open this URL in your browser and sign in as the KalmTouch calendar/email account:

${authorizeUrl}

Waiting for OAuth callback on ${REDIRECT_URI} …
`);
    });
  });

  const refreshToken = await tokenPromise;

  console.log(`
Success. Add this to .env.local:

GOOGLE_REFRESH_TOKEN=${refreshToken}

Then restart npm run dev.
`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
