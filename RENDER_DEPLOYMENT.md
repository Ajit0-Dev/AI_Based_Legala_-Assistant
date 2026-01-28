# Deployment Guide for Render

## Prerequisites
1. A Render account (https://render.com) - Sign up for free
2. Your GitHub repository pushed (✅ Already done)
3. Environment variables ready

## Step 1: Create a Render Account
- Go to https://render.com
- Click "Sign up" and connect with GitHub
- Authorize Render to access your repositories

## Step 2: Create a New Web Service
1. Click **"New"** → **"Web Service"**
2. Select your repository: **AI_Based_Legala_-Assistant**
3. Click **"Connect"**

## Step 3: Configure the Service
Fill in the following settings:

**Name:** 
```
ai-legal-assistant
```

**Environment:** 
```
Python 3
```

**Region:** 
```
Choose closest to you (e.g., US East, Europe)
```

**Branch:** 
```
main
```

**Build Command:** 
```
pip install -r requirements.txt
```

**Start Command:** 
```
gunicorn app:app --bind 0.0.0.0:$PORT --timeout 120
```

## Step 4: Set Environment Variables
Click **"Environment"** and add these variables:

| Key | Value |
|-----|-------|
| `GROQ_API_KEY` | Your Groq API Key |
| `TAVILY_API_KEY` | Your Tavily API Key (optional) |
| `FLASK_ENV` | `production` |
| `PORT` | `10000` |

## Step 5: Configure Health Check (Optional)
- Path: `/api/health`
- Interval: `30`
- Timeout: `10`

## Step 6: Deploy
1. Click **"Create Web Service"**
2. Render will automatically:
   - Build your application
   - Install dependencies
   - Start the Flask server
   - Deploy it live

3. Once deployment is complete, you'll see a live URL like:
   ```
   https://ai-legal-assistant.onrender.com
   ```

## Step 7: Monitor Deployment
- Check the **"Logs"** tab to monitor the deployment process
- Look for: `"Running on http://0.0.0.0:10000"`
- Visit your URL to verify the application is running

## Troubleshooting

### Issue: Deployment Fails
- Check logs for specific error messages
- Verify all environment variables are set
- Ensure `requirements.txt` is up to date
- Check that all imports in `app.py` are correct

### Issue: Application is Slow
- Render free tier has limited resources
- Upgrade to "Standard" plan for better performance
- Current setup with CrewAI may need ~1-2GB RAM

### Issue: Database/Vector DB Issues
- Chroma DB data won't persist between deploys on free tier
- Consider using a managed database service
- Or upgrade to a paid Render plan for persistent storage

## Important Notes

⚠️ **Free Tier Limitations:**
- Auto-spins down after 15 minutes of inactivity
- Limited CPU and memory
- Slow startup time

✅ **To Keep Running 24/7:**
- Upgrade to **Standard** or **Pro** plan
- Add a monitoring service to keep it active

## API Endpoints

After deployment, your API will be available at:

```
POST https://ai-legal-assistant.onrender.com/api/analyze
GET  https://ai-legal-assistant.onrender.com/api/health
GET  https://ai-legal-assistant.onrender.com/
```

Example request:
```bash
curl -X POST https://ai-legal-assistant.onrender.com/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"case_description": "A man broke into my house..."}'
```

## Next Steps

1. Test the live application
2. Monitor logs for any errors
3. Set up auto-deployments (Render does this automatically on push)
4. Consider upgrading plan based on usage

---

Need help? Visit Render docs: https://docs.render.com
