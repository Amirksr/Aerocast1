# AeroCast — Weather Forecasting Platform

A professional, production-ready weather application built with **Next.js 14
(App Router)**, **Tailwind CSS**, **Framer Motion** and a **MongoDB-backed API**.

Live weather data is powered by [Open-Meteo](https://open-meteo.com) (free, no API
key required). User data (favourites, search history, contact messages and
newsletter signups) is stored through a **MongoDB** data layer, which gracefully
falls back to an in-memory store when no database is configured — so the project
runs out of the box.

---

## ✨ Features

- **Live current conditions** — temperature, feels-like, humidity, wind,
  pressure, visibility, UV index, cloud cover and air quality (European AQI).
- **Hourly forecast** — the next 24 hours with precipitation probability.
- **7-day outlook** — min/max temperatures and daily rain chance.
- **Beautiful animated UI** — Framer Motion micro-interactions, page reveals,
  animated weather backgrounds (sun / clouds / rain / snow / lightning / stars),
  light & dark themes.
- **Search anything** — geocoding autocomplete for cities, regions and
  landmarks, plus "use my location".
- **Favourites** — save and manage locations in MongoDB.
- **Customer-facing sections** — hero + live demo, features, how-it-works, live
  stats, testimonials, pricing, FAQ, contact form, newsletter signup, about /
  team / tech stack.
- **Responsive & accessible** — mobile-first layout, reduced-motion support,
  keyboard-friendly controls.
- **Bilingual (EN / FA) with RTL** — a full `LanguageProvider` + dictionary in
  `src/lib/i18n.ts`, a language switcher in the navbar, and automatic
  right-to-left layout for Persian (with a Persian webfont). Choice is persisted
  in `localStorage` and applied before paint to avoid a flash.

## 🧱 Tech stack

| Concern        | Choice                                   |
| -------------- | ---------------------------------------- |
| Framework      | Next.js 14 (App Router, TypeScript)      |
| Styling        | Tailwind CSS (+ custom design tokens)    |
| Animation      | Framer Motion                            |
| Icons          | lucide-react                             |
| Theming        | next-themes                              |
| Weather data   | Open-Meteo (forecast + geocoding + AQI)  |
| Database       | MongoDB via Mongoose (with in-memory fallback) |
| API            | Route Handlers under `src/app/api/*`     |

## 🚀 Getting started

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Configure MongoDB. Copy the example env and add your URI.
cp .env.example .env.local
#   Set MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/aero_weather
#   If you skip this, the app uses an in-memory store automatically.

# 3. (Optional) Seed initial stats + popular cities
npm run seed

# 4. Run the dev server
npm run dev
#   → http://localhost:3000
```

### Production build

```bash
npm run build
npm run start
```

> **Note for low-memory CI environments:** `next build` runs type-checking and
> linting in parallel workers that can exceed tight memory caps. Those steps are
> disabled in `next.config.mjs` for the build; run `npx tsc --noEmit` separately
> if you want full type validation in a constrained runner.

## ✅ Testing

The suite runs on Jest, wired through `next/jest` so it shares the app's SWC
config, `@/*` path alias and env loading — no separate Babel/webpack setup.

```bash
npm test              # run once
npm run test:watch    # watch mode while developing
npm run test:coverage # run with a coverage report
```

Coverage focuses on logic that's actually worth unit-testing rather than
padding a number:

- `src/lib/weather.ts` — WMO code → label/theme mapping, and assembling
  `current`/`hourly`/`daily` forecast data from the Open-Meteo API (network
  calls are mocked, so tests run offline and deterministically).
- `src/lib/store.ts` — the in-memory fallback data layer used whenever
  `MONGODB_URI` isn't set (favorites de-duplication, the 25-entry history
  cap, newsletter dedupe, stat counters).
- `src/lib/validation.ts` — the contact-form validation rules, extracted out
  of the API route so they can be tested as plain functions.

UI components and the Mongoose-backed code paths aren't covered yet; that's
an intentional next step rather than an oversight.

## 🔌 API reference

All endpoints return JSON. The weather endpoints require outbound network access
to `api.open-meteo.com`.

| Method     | Endpoint                  | Description                                       |
| ---------- | ------------------------- | ------------------------------------------------- |
| `GET`      | `/api/weather?q=<city>`   | Geocode + full forecast for a place               |
| `GET`      | `/api/weather?lat=&lon=`  | Forecast by coordinates (optional `name`, `country`, `admin1`) |
| `GET`      | `/api/geocode?q=<query>`  | Location search autocomplete                      |
| `GET`      | `/api/popular`            | Curated starting cities                           |
| `GET`      | `/api/favorites`          | List saved favourites (MongoDB)                   |
| `POST`     | `/api/favorites`          | Add a favourite `{ name, latitude, longitude, … }`|
| `DELETE`    | `/api/favorites?id=<id>`  | Remove a favourite                                |
| `GET`/`POST`| `/api/search-history`     | Rolling recent-search log                         |
| `GET`/`POST`| `/api/contact`            | Submit a contact message                          |
| `POST`     | `/api/newsletter`         | Subscribe an email                                |
| `GET`      | `/api/stats`              | Landing-page counters                             |

### Example

```bash
curl "http://localhost:3000/api/weather?q=Tehran"
```

## 🗂 Project structure

```
src/
├── app/
│   ├── api/            # Route handlers (MongoDB-backed)
│   ├── about/          # About / story / team / tech stack
│   ├── contact/        # Contact form + info
│   ├── favorites/      # Saved locations manager
│   ├── globals.css     # Tailwind + custom weather animations
│   ├── layout.tsx      # Root layout, fonts, theme provider, nav + footer
│   ├── page.tsx        # Landing page + live forecast demo
│   ├── loading.tsx     # Route loading state
│   └── not-found.tsx   # Custom 404
├── components/
│   ├── sections/       # Landing sections (hero, features, pricing, …)
│   ├── *.tsx           # UI building blocks (search, dashboard, navbar, …)
└── lib/
    ├── weather.ts      # Open-Meteo client + WMO code mapping
    ├── db.ts           # Mongoose connection (cached)
    ├── store.ts        # Unified data-access layer (Mongo ⇄ in-memory)
    ├── seed-data.ts    # Seed stats + popular cities
    └── utils.ts        # Formatting + class helpers
```

## 🌍 Environment variables

| Variable         | Required | Default        | Description                          |
| ---------------- | -------- | -------------- | ------------------------------------ |
| `MONGODB_URI`    | No*      | —              | MongoDB connection string            |
| `MONGODB_DB`     | No       | `aero_weather` | Database name                        |
| `NEXT_PUBLIC_SITE_URL` | No | `http://localhost:3000` | Used for metadata / OG   |

\*Without `MONGODB_URI` the app uses an in-memory store and works for demos/PoCs.

## 🚀 Deploy to Vercel

This project deploys to [Vercel](https://vercel.com) with **zero configuration** —
Vercel auto-detects Next.js, runs `npm run build` and serves the `.next` output.

### Dashboard deploy
1. Push this repository to GitHub.
2. In Vercel, click **Add New → Project** and import the repo.
3. Framework preset is **Next.js** (auto-detected); build command
   `npm run build`, output directory `.next` (both auto-filled).
4. *(Optional)* Add environment variables (table below). Without `MONGODB_URI`
   the app runs using its in-memory fallback — great for a quick demo.
5. Click **Deploy**.

### CLI deploy
```bash
npm install -g vercel
vercel        # preview deployment (log in when prompted)
vercel --prod # production deployment
```

### Environment variables (Project Settings → Environment Variables)
| Key                     | Value                                | Required | Notes                                         |
| ----------------------- | ------------------------------------ | -------- | --------------------------------------------- |
| `MONGODB_URI`           | `mongodb+srv://<user>:<pass>@<cluster>/aero_weather` | No* | Enables persistent favourites / history. Without it, an in-memory store is used. |
| `MONGODB_DB`            | `aero_weather`                       | No       | Database name.                                |
| `NEXT_PUBLIC_SITE_URL`  | `https://your-domain.vercel.app`     | No       | Used for metadata / Open Graph.              |

\\*The app is fully functional without a database — data simply resets on a new
server instance.

## 📄 License

MIT — build something great.
