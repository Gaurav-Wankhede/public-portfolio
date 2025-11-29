# How to Deploy Your Portfolio

This guide walks you through deploying all three parts of your portfolio step-by-step.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Your Portfolio                        │
├─────────────────┬─────────────────┬─────────────────────────┤
│    Frontend     │    Dashboard    │        Backend          │
│  (Public Site)  │  (Admin Panel)  │      (Rust API)         │
│                 │                 │                         │
│  Cloudflare     │   Cloudflare    │      Shuttle.rs         │
│    Pages        │     Pages       │                         │
└────────┬────────┴────────┬────────┴────────────┬────────────┘
         │                 │                      │
         └─────────────────┴──────────────────────┘
                           │
                    ┌──────┴──────┐
                    │   MongoDB   │
                    │   Atlas     │
                    └─────────────┘
```

| Platform | Purpose | Hosting |
|----------|---------|---------|
| **Frontend** | Public portfolio website visitors see | Cloudflare Pages |
| **Dashboard** | Admin panel to manage projects & certificates | Cloudflare Pages |
| **Backend** | API server, database, AI chat | Shuttle.rs |

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Part 1: Push to GitHub](#part-1-push-to-github)
3. [Part 2: Deploy Backend to Shuttle.rs](#part-2-deploy-backend-to-shuttlers)
4. [Part 3: Deploy Frontend to Cloudflare Pages](#part-3-deploy-frontend-to-cloudflare-pages)
5. [Part 4: Deploy Dashboard to Cloudflare Pages](#part-4-deploy-dashboard-to-cloudflare-pages)
6. [Part 5: Verify Everything Works](#part-5-verify-everything-works)
7. [Troubleshooting](#troubleshooting)
8. [Custom Domain Setup](#custom-domain-setup)

---

## Prerequisites

Before starting, install these tools:

```bash
# Check Node.js (need 18+)
node --version

# Install pnpm
npm install -g pnpm

# Check Rust
rustc --version

# Check Git
git --version
```

Create accounts on:
- [ ] [GitHub](https://github.com/) - Code hosting
- [ ] [Cloudflare](https://cloudflare.com/) - Frontend & Dashboard hosting (free)
- [ ] [Shuttle.rs](https://shuttle.rs/) - Backend hosting (free)
- [ ] [MongoDB Atlas](https://www.mongodb.com/atlas) - Database (free)
- [ ] [Google AI Studio](https://aistudio.google.com/) - Gemini API for chat (free)

---

## Part 1: Push to GitHub

### Step 1.1: Fork the Repository

1. Go to https://github.com/Gaurav-Wankhede/public-portfolio
2. Click **"Fork"** button (top-right)
3. Select your account
4. Wait for fork to complete

### Step 1.2: Clone to Your Computer

```bash
git clone https://github.com/YOUR-USERNAME/public-portfolio.git
cd public-portfolio
```

### Step 1.3: Customize Your Information

Edit `frontend/config/site.ts`:

```typescript
export const siteConfig = {
  // Your Information
  ownerName: "Your Full Name",
  ownerFirstName: "YourFirstName",
  ownerInitials: "YN",
  ownerTitle: "Full-Stack Developer",
  ownerBio: "Write a short bio about yourself here.",

  // Site Details
  siteName: "Your Portfolio",
  siteDescription: "My personal portfolio showcasing projects and skills",
  siteUrl: "https://your-portfolio.pages.dev", // Update after deployment

  // Contact
  contactEmail: "your@email.com",

  // Social Links (leave empty if not applicable)
  socialLinks: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "",
    youtube: "",
  },

  // GitHub username (for stats on landing page)
  githubUsername: "yourusername",
};
```

### Step 1.4: Commit and Push

```bash
git add .
git commit -m "Customize portfolio with my information"
git push
```

---

## Part 2: Deploy Backend to Shuttle.rs

The backend must be deployed first because the frontend and dashboard need its URL.

### Step 2.1: Set Up MongoDB Atlas

**Create Cluster:**
1. Go to https://www.mongodb.com/atlas
2. Sign up or log in
3. Click **"Build a Database"**
4. Select **"M0 Free"** tier
5. Choose any cloud provider and region
6. Click **"Create"**

**Create Database User:**
1. Go to **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Authentication: Password
4. Username: `portfolio-admin`
5. Password: Click **"Autogenerate Secure Password"**
6. **Copy and save this password somewhere safe**
7. Database User Privileges: "Read and write to any database"
8. Click **"Add User"**

**Allow Network Access:**
1. Go to **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"**
4. Click **"Confirm"**

**Get Connection String:**
1. Go to **"Database"** in left sidebar
2. Click **"Connect"** on your cluster
3. Select **"Drivers"**
4. Copy the connection string
5. Replace `<password>` with your saved password

Example:
```
mongodb+srv://portfolio-admin:MySecurePass123@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

### Step 2.2: Get Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Click **"Create API Key"**
3. Copy the key

### Step 2.3: Install Shuttle CLI

```bash
cargo install cargo-shuttle
```

### Step 2.4: Login to Shuttle

```bash
cargo shuttle login
```

Browser opens → Log in with GitHub → Return to terminal

### Step 2.5: Configure Backend Secrets

```bash
cd backend
```

Create file `Secrets.toml`:

```toml
# Database
MONGODB_URI = "mongodb+srv://portfolio-admin:YOUR_PASSWORD@cluster0.xxx.mongodb.net/?retryWrites=true&w=majority"

# Admin Login (you'll use these to access the dashboard)
ADMIN_EMAIL = "admin@yourdomain.com"
ADMIN_PASSWORD = "choose-a-strong-password"

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET = "paste-your-generated-secret-here"

# AI Chat
GOOGLE_API_KEY = "your-gemini-api-key"
```

Generate JWT secret:
```bash
openssl rand -base64 32
```

### Step 2.6: Deploy Backend

```bash
# Initialize project on Shuttle
cargo shuttle project start

# Deploy
cargo shuttle deploy
```

Wait 3-5 minutes for build and deployment.

**Save the URL you receive:**
```
Service is running at https://your-project-name.shuttle.app
```

### Step 2.7: Test Backend

```bash
# Health check
curl https://your-project-name.shuttle.app/health
# Expected: {"status":"ok"}

# Test login
curl -X POST https://your-project-name.shuttle.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yourdomain.com","password":"your-password"}'
# Expected: {"token":"eyJ..."}
```

---

## Part 3: Deploy Frontend to Cloudflare Pages

### Step 3.1: Connect to Cloudflare

1. Go to https://dash.cloudflare.com/
2. Click **"Workers & Pages"** in left sidebar
3. Click **"Create application"**
4. Select **"Pages"** tab
5. Click **"Connect to Git"**
6. Click **"Connect GitHub"**
7. Authorize Cloudflare
8. Select your `public-portfolio` repository
9. Click **"Begin setup"**

### Step 3.2: Configure Build Settings

| Setting | Value |
|---------|-------|
| Project name | `my-portfolio-frontend` |
| Production branch | `main` |
| Framework preset | `Next.js` |
| Build command | `cd frontend && pnpm install && pnpm build` |
| Build output directory | `frontend/.next` |

### Step 3.3: Add Environment Variables

Click **"Add variable"** for each:

| Variable | Value |
|----------|-------|
| `NODE_VERSION` | `18` |
| `BACKEND_URL` | `https://your-project-name.shuttle.app` |

### Step 3.4: Deploy

1. Click **"Save and Deploy"**
2. Wait 2-5 minutes
3. Note your URL: `https://my-portfolio-frontend.pages.dev`

### Step 3.5: Verify Frontend

1. Visit your Cloudflare Pages URL
2. Check homepage loads
3. Click through Projects, About, Contact
4. Try the chat feature

---

## Part 4: Deploy Dashboard to Cloudflare Pages

### Step 4.1: Create New Cloudflare Pages Project

1. Go to https://dash.cloudflare.com/
2. Click **"Workers & Pages"**
3. Click **"Create application"**
4. Select **"Pages"** tab
5. Click **"Connect to Git"**
6. Select the **same repository** (`public-portfolio`)
7. Click **"Begin setup"**

### Step 4.2: Configure Build Settings

| Setting | Value |
|---------|-------|
| Project name | `my-portfolio-dashboard` |
| Production branch | `main` |
| Framework preset | `Next.js` |
| Build command | `cd dashboard && pnpm install && pnpm build` |
| Build output directory | `dashboard/.next` |

### Step 4.3: Add Environment Variables

| Variable | Value |
|----------|-------|
| `NODE_VERSION` | `18` |
| `BACKEND_URL` | `https://your-project-name.shuttle.app` |

### Step 4.4: Deploy

1. Click **"Save and Deploy"**
2. Wait 2-5 minutes
3. Note your URL: `https://my-portfolio-dashboard.pages.dev`

### Step 4.5: Login to Dashboard

1. Visit your dashboard URL
2. Enter email: (the `ADMIN_EMAIL` from Secrets.toml)
3. Enter password: (the `ADMIN_PASSWORD` from Secrets.toml)
4. Click **"Sign In"**

---

## Part 5: Verify Everything Works

### Checklist

- [ ] **Frontend** loads at `https://your-frontend.pages.dev`
- [ ] **Dashboard** loads at `https://your-dashboard.pages.dev`
- [ ] Can login to dashboard with admin credentials
- [ ] Can add a project in dashboard
- [ ] New project appears on frontend
- [ ] Chat feature works on frontend
- [ ] GitHub stats show on landing page (if username configured)

### Add Your First Project

1. Go to Dashboard → Projects
2. Click **"Add Project"**
3. Fill in:
   - Title
   - Description
   - Technologies used
   - GitHub URL (optional)
   - Demo URL (optional)
4. Click **"Save"**
5. Visit frontend → Projects page
6. Your project should appear

---

## Troubleshooting

### Frontend Build Fails

**"Module not found"**
```bash
cd frontend
rm -rf node_modules .next
pnpm install
pnpm build
```

**"Build timeout"**
- Cloudflare has 20-minute limit
- Ensure build command includes `pnpm install`

### Backend Deploy Fails

**"Secrets.toml not found"**
- File must be in `backend/` folder
- Check filename is exactly `Secrets.toml`

**"MongoDB connection failed"**
- Verify connection string is correct
- Check password has no special characters that need escaping
- Ensure "Allow Access from Anywhere" is enabled in MongoDB Atlas

### Dashboard Login Fails

**"Invalid credentials"**
- Email and password must match `Secrets.toml` exactly
- No extra spaces before/after

**"Network error"**
- Verify `BACKEND_URL` environment variable is set in Cloudflare
- Check backend is running: `curl https://your-backend.shuttle.app/health`

### Chat Not Working

**"AI error"**
- Verify `GOOGLE_API_KEY` is set in backend `Secrets.toml`
- Check Gemini API quota at https://aistudio.google.com/

---

## Custom Domain Setup

### Frontend/Dashboard (Cloudflare Pages)

1. Go to your project in Cloudflare Pages
2. Click **"Custom domains"**
3. Click **"Set up a custom domain"**
4. Enter: `portfolio.yourdomain.com`
5. Cloudflare automatically configures DNS if domain is on Cloudflare

For external domains:
- Add CNAME record: `portfolio` → `your-project.pages.dev`

### Backend (Shuttle.rs)

Edit `backend/Shuttle.toml`:
```toml
name = "your-project-name"
```

Shuttle provides `your-project-name.shuttle.app` by default.

For custom domains, add DNS:
- CNAME: `api` → `your-project-name.shuttle.app`

---

## Quick Reference

### URLs

| Service | URL |
|---------|-----|
| Frontend | `https://your-frontend.pages.dev` |
| Dashboard | `https://your-dashboard.pages.dev` |
| Backend | `https://your-project.shuttle.app` |

### Commands

| Command | Location | Purpose |
|---------|----------|---------|
| `pnpm dev` | `frontend/` | Run frontend locally |
| `pnpm dev` | `dashboard/` | Run dashboard locally |
| `cargo shuttle run` | `backend/` | Run backend locally |
| `cargo shuttle deploy` | `backend/` | Deploy backend |
| `git push` | root | Trigger Cloudflare rebuild |

### Files to Customize

| File | Purpose |
|------|---------|
| `frontend/config/site.ts` | Your name, bio, social links |
| `frontend/public/logo.png` | Your logo/avatar |
| `frontend/public/og-image.jpg` | Social media preview image |
| `backend/Secrets.toml` | Database, API keys, admin login |

---

## Next Steps

After deployment:

1. **Add Projects** - Use dashboard to add your work
2. **Add Certificates** - Showcase your certifications
3. **Custom Domain** - Set up `yourname.com`
4. **Update README** - Customize the GitHub repo description
5. **Share** - Add portfolio link to LinkedIn, resume, etc.
