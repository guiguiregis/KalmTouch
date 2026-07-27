# KalmTouch

Website for **KalmTouch**, a massage and restorative bodywork studio.

## Stack

- [Next.js](https://nextjs.org) (App Router)
- TypeScript
- Tailwind CSS v4
- [@googleapis/calendar](https://www.npmjs.com/package/@googleapis/calendar)

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Google Calendar + contact email setup

Visitors never sign in to Google. They book or send a message on the site.
You connect the studio Google account **once**; the server then creates calendar
events and sends contact emails through Gmail.

### 1. Google Cloud project (studio owner only)

1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Create (or select) a project
3. **APIs & Services → Library** → enable **Google Calendar API** and **Gmail API**
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

### 2. Connect the studio Google account (one time)

```bash
npm run google:auth
```

Sign in as **kalmtouch18@gmail.com**, approve **Calendar** and **Gmail send** access, then paste the printed refresh token into `.env.local`:

```env
GOOGLE_REFRESH_TOKEN=...
```

If you already connected Calendar earlier, run `google:auth` again so the token includes Gmail send.

Restart the dev server.

### 3. Verify

- Visit `/#book` and confirm times appear
- Book a test slot with your own email
- Check Google Calendar for the event and invite
- Submit the contact form on `/#contact` and confirm the email arrives

## Scripts

- `npm run dev` — start the development server
- `npm run build` — production build
- `npm start` — run the production server
- `npm run lint` — run ESLint
- `npm run google:auth` — one-time Google OAuth for Calendar + Gmail
- `npm run calendar:auth` — alias for `google:auth`
