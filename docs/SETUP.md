# Complete Setup Guide

This guide walks you through setting up your Open Portfolio Stack from scratch.

## Table of Contents
1. [Quick Start (Demo Mode)](#1-quick-start-demo-mode)
2. [MongoDB Atlas Setup](#2-mongodb-atlas-setup)
3. [Google Gemini API Setup](#3-google-gemini-api-setup)
4. [Backend Deployment](#4-backend-deployment)
5. [Frontend Deployment](#5-frontend-deployment)
6. [Dashboard Deployment](#6-dashboard-deployment)
7. [Wiring Everything Together](#7-wiring-everything-together)

---

## 1. Quick Start (Demo Mode)

Want to see the portfolio in action before setting up the backend? The frontend works out-of-box with demo data!

```bash
cd frontend
pnpm install
pnpm dev
```

Visit http://localhost:3000 to see the portfolio with sample projects and certificates.

To customize demo data, edit `frontend/lib/data/fallback.ts`.

---

## 2. MongoDB Atlas Setup

### Step 1: Create Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Verify your email

### Step 2: Create a Cluster
1. Click "Build a Database"
2. Choose **M0 Free Tier** (Shared)
3. Select your preferred cloud provider (AWS/GCP/Azure)
4. Choose a region close to your users
5. Name your cluster (e.g., `portfolio-cluster`)
6. Click "Create"

### Step 3: Create Database User
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter a username (e.g., `portfolio-admin`)
5. Generate or create a strong password
6. **Save this password** - you'll need it for the connection string
7. Set privileges to "Read and write to any database"
8. Click "Add User"

### Step 4: Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add specific IP addresses of your servers
5. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster-name.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` with your database username
6. Replace `<password>` with your database password

### Step 6: Create Database and Collections
1. Click "Browse Collections" on your cluster
2. Click "Add My Own Data"
3. Create database: `portfolio`
4. Create initial collection: `projects`

The backend will automatically create other collections when needed.

---

## 3. Google Gemini API Setup

### Step 1: Get API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Select or create a Google Cloud project
5. Copy your API key

### Step 2: Verify API Key
Test your API key with curl:
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

You should get a JSON response with generated content.

### Step 3: API Quotas (Free Tier)
- 60 requests per minute
- 1 million tokens per minute
- No cost for free tier usage

For higher limits, enable billing in Google Cloud Console.

---

## 4. Backend Deployment

### Option A: Deploy to Shuttle.rs (Recommended)

#### Step 1: Install Shuttle CLI
```bash
cargo install cargo-shuttle
```

#### Step 2: Login to Shuttle
```bash
cargo shuttle login
```

#### Step 3: Configure Secrets
Edit `backend/Secrets.toml`:
```toml
# Database
MONGODB_URI = "mongodb+srv://username:password@cluster.mongodb.net/?appName=portfolio"

# Admin Authentication (for dashboard)
ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "your-secure-password-here"
JWT_SECRET = "your-jwt-secret-minimum-32-characters-long"

# AI Chat
GOOGLE_API_KEY = "your-gemini-api-key"
```

**Important**: 
- Use a strong password for `ADMIN_PASSWORD`
- Generate a random string for `JWT_SECRET` (at least 32 characters):
  ```bash
  openssl rand -base64 32
  ```

#### Step 4: Deploy
```bash
cd backend
cargo shuttle deploy
```

#### Step 5: Get Deployed URL
After deployment, you'll get a URL like:
```
https://your-project-name.shuttle.app
```

Save this URL - you'll need it for frontend/dashboard configuration.

### Option B: Deploy to Other Platforms

For VPS/Docker deployment, build the binary:
```bash
cd backend
cargo build --release
```

Set environment variables and run the binary.

---

## 5. Frontend Deployment

### Step 1: Configure Environment
Create `frontend/.env.local`:
```env
# Backend URL (leave empty to use fallback/demo data)
BACKEND_URL="https://your-project-name.shuttle.app"

# Site Configuration
NEXT_PUBLIC_OWNER_NAME="Your Name"
NEXT_PUBLIC_OWNER_FIRST_NAME="YourFirstName"
NEXT_PUBLIC_SITE_NAME="Your Portfolio"
NEXT_PUBLIC_SITE_DESCRIPTION="Your portfolio description"
NEXT_PUBLIC_SITE_URL="https://your-portfolio-domain.com"

# Contact
NEXT_PUBLIC_CONTACT_EMAIL="hello@yourdomain.com"

# Social Links
NEXT_PUBLIC_GITHUB_URL="https://github.com/yourusername"
NEXT_PUBLIC_LINKEDIN_URL="https://linkedin.com/in/yourusername"
```

### Step 2: Build
```bash
cd frontend
pnpm install
pnpm build
```

### Step 3: Deploy

**Vercel (Recommended)**
```bash
npx vercel
```

**Cloudflare Pages**
1. Connect your Git repository
2. Build command: `pnpm build`
3. Output directory: `.next`
4. Add environment variables

**Netlify**
1. Connect your Git repository
2. Build command: `pnpm build`
3. Publish directory: `.next`

---

## 6. Dashboard Deployment

### Step 1: Configure Environment
Create `dashboard/.env.local`:
```env
# Backend URL (required)
BACKEND_URL="https://your-project-name.shuttle.app"

# Site URLs (for CORS)
NEXT_PUBLIC_SITE_URL="https://your-portfolio.com"
NEXT_PUBLIC_DASHBOARD_URL="https://your-dashboard.com"
```

### Step 2: Build
```bash
cd dashboard
pnpm install
pnpm build
```

### Step 3: Deploy
Deploy to Vercel, Cloudflare Pages, or your preferred platform.

### Step 4: Login to Dashboard
1. Visit your dashboard URL
2. Click "Sign In"
3. Enter the `ADMIN_EMAIL` and `ADMIN_PASSWORD` you set in the backend's `Secrets.toml`
4. You're now logged in and can manage projects/certificates

---

## 7. Wiring Everything Together

### Architecture Overview
```
┌─────────────────┐     ┌─────────────────┐
│    Frontend     │────▶│     Backend     │
│ (Public Site)   │     │   (Rust API)    │
└─────────────────┘     └────────┬────────┘
                                 │
┌─────────────────┐              │
│    Dashboard    │──────────────┘
│  (Admin Panel)  │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  MongoDB Atlas  │
│   (Database)    │
└─────────────────┘
```

### Step 1: Verify Backend
```bash
# Health check
curl https://your-project-name.shuttle.app/health

# Test projects API
curl https://your-project-name.shuttle.app/api/v1/projects

# Test login
curl -X POST https://your-project-name.shuttle.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "your-password"}'
```

### Step 2: Add Data via Dashboard
1. Go to your dashboard URL
2. Sign in with admin credentials
3. Add projects and certificates
4. Data appears on frontend immediately

### Step 3: Verify Frontend
1. Visit your frontend URL
2. Check:
   - Projects appear on landing page
   - `/projects` lists all projects
   - `/Ask-Username` chat works
   - `/contact` form works

---

## Troubleshooting

### Backend Issues

**MongoDB Connection Failed**
- Verify connection string format
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

**Chat Not Working**
- Verify GOOGLE_API_KEY is correct
- Check Gemini API quota limits
- Look at backend logs: `cargo shuttle logs`

**Login Failed**
- Verify ADMIN_EMAIL and ADMIN_PASSWORD match exactly
- Check JWT_SECRET is at least 32 characters

### Frontend Issues

**Using Fallback Data**
- This is normal if BACKEND_URL is not set
- Check `X-Data-Source` header in API responses
- Set BACKEND_URL to use real data

**API Calls Failing**
- Check BACKEND_URL is correct
- Verify backend is running
- Check browser console for CORS errors

### Dashboard Issues

**Cannot Login**
- Verify credentials match backend Secrets.toml
- Check backend is accessible
- Clear localStorage and try again

**Cannot Save Data**
- Check JWT token hasn't expired
- Verify backend is running
- Check browser network tab for errors

---

## Environment Variables Reference

### Backend (Secrets.toml)
| Variable | Required | Description |
|----------|----------|-------------|
| MONGODB_URI | Yes | MongoDB connection string |
| ADMIN_EMAIL | Yes | Admin login email |
| ADMIN_PASSWORD | Yes | Admin login password |
| JWT_SECRET | Yes | Secret for JWT tokens (32+ chars) |
| GOOGLE_API_KEY | Yes | Gemini API key for chat |

### Frontend (.env.local)
| Variable | Required | Description |
|----------|----------|-------------|
| BACKEND_URL | No | Backend API URL (uses fallback if empty) |
| NEXT_PUBLIC_OWNER_NAME | Yes | Your name displayed on site |
| NEXT_PUBLIC_SITE_NAME | Yes | Portfolio title |
| NEXT_PUBLIC_SITE_URL | No | Your site URL |

### Dashboard (.env.local)
| Variable | Required | Description |
|----------|----------|-------------|
| BACKEND_URL | Yes | Backend API URL |
| NEXT_PUBLIC_SITE_URL | No | Main site URL |
| NEXT_PUBLIC_DASHBOARD_URL | No | Dashboard URL |

---

## Video Tutorials

Learn how to deploy your portfolio with these step-by-step video guides:

### Frontend Deployment

| Platform | Tutorial |
|----------|----------|
| **Vercel** | [Deploy Next.js to Vercel](https://www.youtube.com/watch?v=2HBIzEx6IZA) |
| **Cloudflare Pages** | [Deploy to Cloudflare Pages](https://www.youtube.com/watch?v=MTc2CTYoszY) |
| **Netlify** | [Deploy Next.js to Netlify](https://www.youtube.com/watch?v=yE_y4EBq9wA) |
| **AWS Amplify** | [Deploy to AWS Amplify](https://www.youtube.com/watch?v=DHLZAzdT44Y) |

### Backend Deployment

| Platform | Tutorial |
|----------|----------|
| **Shuttle.rs** | [Deploy Rust to Shuttle](https://www.youtube.com/watch?v=FTJvRK9gzXE) |
| **Railway** | [Deploy Backend to Railway](https://www.youtube.com/watch?v=HwCX5JFT_N8) |
| **Render** | [Deploy to Render](https://www.youtube.com/watch?v=bnCOyGaSe84) |
| **Fly.io** | [Deploy to Fly.io](https://www.youtube.com/watch?v=J7Fm7MdZn_E) |

### Database Setup

| Service | Tutorial |
|----------|----------|
| **MongoDB Atlas** | [MongoDB Atlas Setup Guide](https://www.youtube.com/watch?v=084rmLU1UgA) |
| **Supabase** | [Supabase Database Setup](https://www.youtube.com/watch?v=dU7GwCOgvNY) |

### Domain & SSL

| Topic | Tutorial |
|----------|----------|
| **Custom Domain** | [Add Custom Domain to Vercel](https://www.youtube.com/watch?v=K3JZycEBhQg) |
| **Cloudflare DNS** | [Cloudflare DNS Setup](https://www.youtube.com/watch?v=XQKkb84EjNQ) |

### Full Stack Deployment Guides

| Guide | Tutorial |
|----------|----------|
| **Complete Next.js Deployment** | [Production Deployment Guide](https://www.youtube.com/watch?v=OgDuT_sLOKY) |
| **CI/CD with GitHub Actions** | [Automate Deployments](https://www.youtube.com/watch?v=R8_veQiYBjI) |

---

## Next Steps

1. **Custom Domain**: Configure in your hosting platform
2. **SEO**: Update metadata in `frontend/config/site.ts`
3. **Customize Demo Data**: Edit `frontend/lib/data/fallback.ts`
4. **Analytics**: Add your preferred analytics
5. **Monitoring**: Set up uptime monitoring
