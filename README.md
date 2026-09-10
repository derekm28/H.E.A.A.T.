# HEAAT (High Expectations At All Times)

A tennis shoe release date app. Built with React, Express, Node.Js and PostgreSQL.

Site: https://h-e-a-a-t.vercel.app/

API: KicksDB StockX API via the server-side `/api/sneakers` proxy

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

<img width="2240" height="1143" alt="Screenshot 2026-05-20 at 5 40 32 PM" src="https://github.com/user-attachments/assets/a5be9f23-90bf-425a-afd1-86b8671531d6" />

<img width="2240" height="1143" alt="Screenshot 2026-05-20 at 5 41 00 PM" src="https://github.com/user-attachments/assets/9d263ac4-d473-4ae1-9880-bc82fdcd9093" />

<img width="2240" height="1143" alt="Screenshot 2026-05-20 at 5 41 21 PM" src="https://github.com/user-attachments/assets/9d0cdf0e-3c7b-429e-919d-223988d19447" />
