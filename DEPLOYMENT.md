# Deployment Guide: Prayosha Invoice

This project is configured as a monorepo containing both a React frontend (Vite) and an Express backend. It is optimized for deployment on **Vercel**.

## Option 1: Vercel (Recommended for simplicity)

### 1. Prerequisites
- Push your code to a GitHub repository (Done).

### 2. Vercel Project Setup
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New** > **Project**.
2. Import your GitHub repository (`prayosha_invoice`).
3. **Important Build Settings**:
   - **Framework Preset**: Vite (detected automatically).
   - **Root Directory**: Leave it as the root (`/`). Vercel will use the `vercel.json` file to manage both folders.
   - **Build Command**: Leave default.
   - **Output Directory**: Leave default.

### 3. Environment Variables
In the Vercel Dashboard, go to **Settings** > **Environment Variables** and add:
- `MONGO_URI`: Your MongoDB connection string.
- `NODE_ENV`: `production`
- `VITE_API_URL`: Set to `/api` (or your backend URL if hosted elsewhere).

### 4. Direct Deployment
Vercel will automatically deploy every time you push to the `main` branch.

---

## Option 2: Render (Recommended for heavy backend tasks)

If you find that the backend is slow or you need to add WebSockets (real-time features) later, **Render** is a better alternative for the backend.

### Backend on Render
1. Create a **Web Service** on Render.
2. Root Directory: `server`
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Add `MONGO_URI` to Environment Variables.

### Frontend on Vercel
If you host the backend on Render, you must update `client/src/services/api.js` with your Render API URL:
```javascript
const api = axios.create({
    baseURL: 'https://your-render-app.onrender.com/api',
});
```

---

## Verification
Once deployed, check your Vercel URL:
- Frontend should be visible at `https://your-app.vercel.app/`
- Backend should be reachable at `https://your-app.vercel.app/api`
