# Veronica Adane | Official Platform

Vercel-ready `Next.js` application for Veronica Adane's official platform. Built with a deeply integrated custom CMS and admin workspace.

## Tech Stack

- **Framework**: `Next.js` 14 (App Router)
- **Language**: `TypeScript`
- **Styling**: Vanilla CSS Modules & CSS Custom Properties + Tailwind CSS (Utility)
- **Database**: `MongoDB` (Official Node driver)
- **Authentication**: `NextAuth` / `Auth.js`
- **Media Delivery**: `Cloudinary`
- **Animations**: `Lenis` (Smooth scroll) and `motion/react` (Framer motion)

---

## 🛠️ Environment Configuration

The application requires environment variables for Database access, Authentication, and Media hosting.

Copy `.env.example` to `.env.local` and configure the values:

```bash
# Site Environment
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development

# MongoDB Access (Used for CMS Storage)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/
MONGODB_DB_NAME=veronica_adane

# Auth.js / NextAuth
AUTH_SECRET=your-secure-random-string-generate-with-openssl
AUTH_URL=http://localhost:3000/api/auth

# Cloudinary Setup (For automatic media uploads from Admin Workspace)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> [!WARNING]
> `AUTH_SECRET` is strictly enforced. The production server will aggressively **abort startup** if `AUTH_SECRET` is undefined, protecting you from running unencrypted session cookies in the wild.

---

## 🚀 Local Development

1. Setup Node (Requires v18+)
```bash
npm install
```

2. Start the development server
```bash
npm run dev
```

The site runs on [http://localhost:3000](http://localhost:3000).
The Admin workspace is available at `/admin` (requires valid authentication).

---

## 🏗️ Architecture

### Custom Built CMS
This project uses a bespoke MongoDB-backed CMS. Content is edited entirely graphically via the `AdminWorkspace` and serialized as JSON documents.
- **Pages**: Sections, Heros, Titles, and Copy text are defined dynamically in the CMS.
- **Site Settings**: Global navigational footers, signals, utility links, and kickers are unified under `CmsSiteSettings`.
- **Media Assets**: All media (Posters, MP4s, Cover art) uploaded to Cloudinary create a mirroring `CmsMediaAsset` reference in Mongo.

### Admin Workspace Modules
The `/admin` UI is isolated cleanly into three major orchestrator screens:
- **Page Editor**: JSON validation, realtime draft sync, and fast-updating tools against public routes.
- **Site Settings Editor**: Control the global components rendered throughout the application wrapper.
- **Media Browser**: Filterably preview sync-statuses and upload files straight to Cloudinary directories. 

### Performance Specs
- Highly-cacheable Incremental Static Regeneration (`revalidate = 60`) on all public pages.
- Lazy-evaluated `useEffect`-scoped initializations for heavy smooth scrolling UI bindings (`Lenis`).
- Safe, generic SVG blur data structures for instant perceived load times on hero sliders.

## 🧪 Testing

Tests are orchestrated using `Vitest` with React Testing Library.

```bash
npm run test
```
