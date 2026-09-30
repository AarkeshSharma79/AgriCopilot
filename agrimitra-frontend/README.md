# AgriMitra — Smart Agriculture Copilot (Frontend)
A React + Vite + Tailwind CSS dashboard for an AI-powered agricultural advisory platform, matching the provided reference design (crop health overview, weather, soil health, AI recommendations, alerts, water usage, crop monitoring with disease detection, and precision farming zone analysis).

## Stack
- React 18 + Vite
- Tailwind CSS (custom forest/leaf color palette)
- React Router v6
- Recharts (line chart, donut gauges)
- Lucide React (icons)
- Axios (API service layer)

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

Copy `.env.example` to `.env` and point `VITE_API_BASE_URL` at your backend API.

```bash
cp .env.example .env
npm run build   # production build to /dist
```

## Structure

- `src/components` — reusable UI pieces (Sidebar, Navbar, cards, panels)
- `src/pages` — one page per sidebar route
- `src/services` — Axios-based API calls (weather, crop, soil, AI assistant)
- `src/context` — Auth and Farm context providers
- `src/hooks` — data-fetching hooks built on the services layer
- `src/utils` — formatting and status-color helpers

## Notes

- `src/services/*` call a REST backend under `/api` (see `.env.example`); wire these to your Node/Express + FastAPI backend.
- Images referenced under `/public/images` (avatar, sample leaf) are placeholders — drop real assets in with the same filenames, or update the `src` paths in `Sidebar.jsx` and `CropMonitoringPanel.jsx`.
- The dashboard is fully responsive down to mobile; the sidebar collapses on small screens.
