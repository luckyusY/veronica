# Veronica Adane Website

Vercel-ready `Next.js` starter for Veronica Adane's official platform, built with:

- `Next.js` App Router
- `TypeScript`
- `Tailwind CSS`
- `MongoDB` via the official `mongodb` driver

## Included So Far

- Cinematic black-and-gold site shell inspired by the reference entertainment theme
- Homepage with sections for story, releases, events, shop, collaborations, and press
- Main route scaffolds:
  - `/about`
  - `/music`
  - `/events`
  - `/shop`
  - `/collaborations`
  - `/media`
  - `/contact`
- MongoDB environment wiring in `src/lib/mongodb.ts`
- API health endpoint at `/api/health`

## Environment Variables

Copy `.env.example` to `.env.local` and update the values if needed:

```bash
MONGODB_URI=...
MONGODB_DB_NAME=veronica_adane
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Local Development

```bash
npm install
npm run dev
```

The site runs on [http://localhost:3000](http://localhost:3000).

## Suggested Next Build Steps

1. Add MongoDB collections for `releases`, `events`, `products`, `orders`, and `inquiries`.
2. Build an admin dashboard for content and commerce operations.
3. Connect payment processing and QR ticket generation.
4. Replace placeholder copy with approved brand assets, photography, and official management contacts.
