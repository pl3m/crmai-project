# Railway Deployment Guide

## Quick Setup:

1. **Go to [railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your `crmai-project` repository**
6. **Select the `ai-service` folder as the root directory**

## Environment Variables:

Add these in Railway dashboard:

- `PORT` (Railway sets this automatically)
- Any other environment variables your app needs

## Build Settings:

- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

## After Deployment:

1. **Copy the Railway URL** (e.g., `https://your-app.railway.app`)
2. **Update your Next.js app** to use this URL for AI service calls
3. **Test the deployment** by visiting `/health` endpoint

## Troubleshooting:

- Check Railway logs if deployment fails
- Ensure all dependencies are in requirements.txt
- Verify the start command is correct
