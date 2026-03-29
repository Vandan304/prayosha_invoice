# Deployment Guide: Prayosha Invoice

This project is configured as a monorepo containing both a React frontend (Vite) and an Express backend. It is optimized for deployment on **Vercel**.

## Option 1: Vercel (Recommended)

### 1. Prerequisites
- Push your code to a GitHub repository (Ensure `package.json` has `vite: ^6.2.0`).

### 2. Vercel Project Setup (Fixing 404)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New** > **Project**.
2. Import your GitHub repository (`prayosha_invoice`).
3. **CRITICAL SETTINGS** (Match your screenshot):
   - **Root Directory**: Project root (leave as is).
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/dist`
   - **Install Command**: `cd client && npm install && cd ../server && npm install`

### 3. Why did I get a 404?
- By default, Vercel doesn't know your app is in two folders. These settings tell Vercel exactly where to build the frontend and where the outputs are.
- `NODE_ENV`: `production`
- `VITE_API_URL`: `/api`

### 4. Why did I get a 404?
- If you set the "Root Directory" to `client`, the backend will not work.
- The new `vercel.json` fixes routing so that `/` goes to the frontend and `/api` goes to the backend.

---

## Troubleshooting Backend
If your backend is still not responding:
1. Check **Functions** tab in Vercel to see if `server/server.js` was built.
2. Check **Logs** for any database connection errors.

---

## Option 2: Render (Alternative)
If you need an always-on backend with no cold starts, use Render for the `server` folder and Vercel for the `client` folder.
