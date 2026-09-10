# HEAAT (High Expectations At All Times)

A tennis shoe release date app. Built with React, Express, Node.Js and PostgreSQL.

Site: https://heaat.herokuapp.com/

API: https://rapidapi.com/tg4-solutions-tg4-solutions-default/api/v1-sneakers/details

Current Features:

1. Displays popular sporting and designer sneaker details on display cards
2. Account Creation

Features to be implemented:

1. Favoriting
2. Shopping Cart functionality

## Local development (Vite)

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview production build:

```bash
npm run preview
```

## Vercel deployment

This project is configured for Vercel with SPA rewrites via `vercel.json`, so client routes like `/shoes/nike` resolve correctly.
## API setup

The app uses the KicksDB StockX API through the server-side `/api/sneakers` proxy. Set `KICKSDB_API_KEY` in the local environment or in the deployment provider before running the app. See `.env.example` for the required variable.
