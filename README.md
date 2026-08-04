# KalmTouch

Website for **KalmTouch**, a massage and restorative bodywork studio.

## Stack

- [Next.js](https://nextjs.org) (App Router)
- TypeScript
- Tailwind CSS v4
- [@googleapis/calendar](https://www.npmjs.com/package/@googleapis/calendar)
- [@googleapis/drive](https://www.npmjs.com/package/@googleapis/drive)
- [@googleapis/sheets](https://www.npmjs.com/package/@googleapis/sheets)

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Google Calendar + contact email + intake setup

Visitors never sign in to Google. They book or send a message on the site.
You connect the studio Google account **once**; the server then creates calendar
events, sends contact emails through Gmail, uploads intake PDFs to Drive, and
appends client rows to Sheets.

### 1. Google Cloud project (studio owner only)

1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Create (or select) a project
3. **APIs & Services → Library** → enable **Google Calendar API**, **Gmail API**, **Google Drive API**, and **Google Sheets API**
4. **APIs & Services → OAuth consent screen**
   - User type: **External**
   - App name: KalmTouch
   - Add `kalmtouch18@gmail.com` as a **test user**
5. **APIs & Services → Credentials → Create credentials → OAuth client ID**
   - Application type: **Web application**
   - Name: KalmTouch Web
   - Authorized redirect URIs → add:

```text
http://localhost:3333/oauth2callback
```

6. Copy the **Client ID** and **Client secret** into `.env.local`:

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALENDAR_ID=primary
CONTACT_TO_EMAIL=kalmtouch18@gmail.com
GOOGLE_SENDER_EMAIL=kalmtouch18@gmail.com
```

7. Create a **Drive folder** for intake PDFs and a **Google Sheet** for clients.
   In the Sheet, create a tab named `Clients` (or set `GOOGLE_SHEETS_RANGE`).
   Suggested header row:

```text
date_soumission | nom | téléphone | adresse | email | eventId | lien_drive | statut_formulaire
```

   Paste IDs into `.env.local`:

```env
GOOGLE_DRIVE_INTAKE_FOLDER_ID=...
GOOGLE_SHEETS_CLIENTS_ID=...
GOOGLE_SHEETS_RANGE=Clients!A:H
```

### 2. Connect the studio Google account (one time)

```bash
npm run google:auth
```

Sign in as **kalmtouch18@gmail.com**, approve **Calendar**, **Gmail send**,
**Drive**, and **Sheets** access, then paste the printed refresh token into `.env.local`:

```env
GOOGLE_REFRESH_TOKEN=...
```

If you already connected earlier with fewer scopes, run `google:auth` again so
the token includes Drive + Sheets.

Restart the dev server.

### 3. Verify

- Visit `/#book` and confirm times appear
- Book a test slot with your own email
- After booking, complete or skip the health intake form
- Check Google Calendar for the event, invite, and intake PDF link
- Check Drive for the PDF and Sheets for a new client row
- Submit the contact form on `/#contact` and confirm the email arrives

## Scripts

- `npm run dev` — start the development server
- `npm run build` — production build
- `npm start` — run the production server
- `npm run lint` — run ESLint
- `npm run google:auth` — one-time Google OAuth for Calendar + Gmail + Drive + Sheets
- `npm run calendar:auth` — alias for `google:auth`
