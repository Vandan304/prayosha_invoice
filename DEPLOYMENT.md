# Deployment Guide: Prayosha Invoice

This project is configured as a monorepo containing both a React frontend (Vite) and an Express backend. It is optimized for deployment on **Vercel**.

## Option 1: Vercel (Recommended)

### 1. Prerequisites
- Push your code to a GitHub repository (Ensure `vercel.json` is in the root).

### 2. Vercel Project Setup (Fixing 404)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New** > **Project**.
2. Import your GitHub repository (`prayosha_invoice`).
3. **CRITICAL SETTINGS**:
   - **Root Directory**: Do **NOT** select `client` or `server`. Leave it as the project root (`./`).
   - **Framework Preset**: Vite.
   - **Build & Output Settings**: Leave as default. The `vercel.json` will handle the routing.

### 3. Environment Variables
In **Settings** > **Environment Variables**, you **MUST** add:
- `MONGO_URI`: (Your MongoDB connection string)
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
