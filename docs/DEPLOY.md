# How to Deploy Your Portfolio

This guide walks you through deploying your portfolio step-by-step. No prior deployment experience needed.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Part 1: Push to GitHub](#part-1-push-to-github)
3. [Part 2: Deploy Frontend to Cloudflare Pages](#part-2-deploy-frontend-to-cloudflare-pages)
4. [Part 3: Deploy Backend to Shuttle.rs](#part-3-deploy-backend-to-shuttlers)
5. [Part 4: Connect Everything](#part-4-connect-everything)

---

## Prerequisites

Before starting, make sure you have:

- [ ] [Node.js 18+](https://nodejs.org/) installed
- [ ] [pnpm](https://pnpm.io/) installed (`npm install -g pnpm`)
- [ ] [Rust](https://rustup.rs/) installed
- [ ] [Git](https://git-scm.com/) installed
- [ ] A [GitHub](https://github.com/) account
- [ ] A [Cloudflare](https://cloudflare.com/) account (free)
- [ ] A [Shuttle.rs](https://shuttle.rs/) account (free)
- [ ] A [MongoDB Atlas](https://www.mongodb.com/atlas) account (free)

---

## Part 1: Push to GitHub

### Step 1.1: Fork or Clone the Repository

**Option A: Fork (Recommended)**
1. Go to https://github.com/Gaurav-Wankhede/public-portfolio
2. Click the "Fork" button in the top-right corner
3. Select your account
4. Clone your forked repo:
```bash
git clone https://github.com/YOUR-USERNAME/public-portfolio.git
cd public-portfolio
```

**Option B: Fresh Start**
```bash
# Clone the original repo
git clone https://github.com/Gaurav-Wankhede/public-portfolio.git
cd public-portfolio

# Remove original git history
rm -rf .git

# Initialize new repo
git init
git add .
git commit -m "Initial commit"
```

### Step 1.2: Create Your GitHub Repository

1. Go to https://github.com/new
2. Enter repository name: `my-portfolio` (or any name you prefer)
3. Choose "Public" or "Private"
4. Do NOT initialize with README (we already have code)
5. Click "Create repository"

### Step 1.3: Push Your Code

```bash
# Add your new repo as remote
git remote add origin https://github.com/YOUR-USERNAME/my-portfolio.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 1.4: Verify

1. Refresh your GitHub repository page
2. You should see all the files uploaded
3. Check that `frontend/`, `backend/`, and `dashboard/` folders exist

---

## Part 2: Deploy Frontend to Cloudflare Pages

### Step 2.1: Prepare Your Frontend

First, customize your portfolio:

```bash
cd frontend
```

Edit `config/site.ts` with your information:

```typescript
export const siteConfig = {
  ownerName: "Your Name",
  ownerFirstName: "YourFirstName",
  ownerTitle: "Your Title (e.g., Full-Stack Developer)",
  ownerBio: "A short bio about yourself",
  
  siteName: "Your Portfolio",
  siteDescription: "Your portfolio description",
  
  contactEmail: "your@email.com",
  
  socialLinks: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "", // Leave empty if not applicable
  },
  
  githubUsername: "yourusername", // For GitHub stats
};
```

Commit your changes:

```bash
git add .
git commit -m "Customize portfolio configuration"
git push
```

### Step 2.2: Connect Cloudflare Pages

1. Go to https://dash.cloudflare.com/
2. Click "Workers & Pages" in the left sidebar
3. Click "Create application"
4. Select "Pages" tab
5. Click "Connect to Git"

### Step 2.3: Authorize GitHub

1. Click "Connect GitHub"
2. Authorize Cloudflare to access your repositories
3. Select your `my-portfolio` repository
4. Click "Begin setup"

### Step 2.4: Configure Build Settings

Enter the following settings:

| Setting | Value |
|---------|-------|
| Project name | `my-portfolio` (or any name) |
| Production branch | `main` |
| Framework preset | `Next.js` |
| Build command | `cd frontend && pnpm install && pnpm build` |
| Build output directory | `frontend/.next` |
| Root directory | `/` |

### Step 2.5: Add Environment Variables

Click "Add variable" and add:

| Variable Name | Value |
|--------------|-------|
| `NODE_VERSION` | `18` |
| `NEXT_PUBLIC_SITE_URL` | `https://my-portfolio.pages.dev` (update after deploy) |

**Note:** Leave `BACKEND_URL` empty for now. The frontend will use fallback data until we deploy the backend.

### Step 2.6: Deploy

1. Click "Save and Deploy"
2. Wait for the build (usually 2-5 minutes)
3. Once complete, you'll get a URL like: `https://my-portfolio.pages.dev`

### Step 2.7: Verify Frontend

1. Visit your Cloudflare Pages URL
2. Check that the site loads
3. Navigate through pages (Projects, About, Contact)
4. The site works with demo data even without a backend

---

## Part 3: Deploy Backend to Shuttle.rs

### Step 3.1: Install Shuttle CLI

```bash
cargo install cargo-shuttle
```

### Step 3.2: Login to Shuttle

```bash
cargo shuttle login
```

This opens a browser window. Log in with your GitHub account.

### Step 3.3: Set Up MongoDB Atlas

Before deploying, you need a database:

1. Go to https://www.mongodb.com/atlas
2. Sign up or log in
3. Create a new project (e.g., "Portfolio")
4. Click "Build a Database"
5. Choose "M0 Free" tier
6. Select a cloud provider and region
7. Click "Create"

**Create Database User:**
1. Go to "Database Access" in sidebar
2. Click "Add New Database User"
3. Enter username: `portfolio-admin`
4. Generate a secure password
5. **Save this password** - you'll need it
6. Click "Add User"

**Allow Network Access:**
1. Go to "Network Access" in sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

**Get Connection String:**
1. Go to "Database" in sidebar
2. Click "Connect" on your cluster
3. Choose "Drivers"
4. Copy the connection string
5. Replace `<password>` with your actual password

Your connection string looks like:
```
mongodb+srv://portfolio-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 3.4: Configure Backend Secrets

```bash
cd backend
```

Create `Secrets.toml`:

```toml
# MongoDB Connection
MONGODB_URI = "mongodb+srv://portfolio-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority"

# Admin Authentication (for dashboard)
ADMIN_EMAIL = "admin@yourdomain.com"
ADMIN_PASSWORD = "choose-a-strong-password-here"
JWT_SECRET = "generate-a-random-32-character-string-here"

# Google Gemini API (for AI chat feature)
GOOGLE_API_KEY = "your-gemini-api-key"
```

**Generate JWT Secret:**
```bash
openssl rand -base64 32
```

**Get Gemini API Key:**
1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

### Step 3.5: Initialize Shuttle Project

```bash
cargo shuttle project start
```

This creates your project on Shuttle's servers.

### Step 3.6: Deploy Backend

```bash
cargo shuttle deploy
```

Wait for the build and deployment (usually 3-5 minutes).

When complete, you'll see:
```
Service is running at https://your-project-name.shuttle.app
```

**Save this URL** - you'll need it for the frontend.

### Step 3.7: Verify Backend

Test your backend is working:

```bash
# Health check
curl https://your-project-name.shuttle.app/health

# Should return: {"status":"ok"}
```

```bash
# Test login
curl -X POST https://your-project-name.shuttle.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@yourdomain.com", "password": "your-password"}'

# Should return a JWT token
```

---

## Part 4: Connect Everything

### Step 4.1: Update Frontend with Backend URL

Go back to Cloudflare Pages:

1. Go to https://dash.cloudflare.com/
2. Click "Workers & Pages"
3. Click on your project
4. Go to "Settings" → "Environment variables"
5. Click "Add variable"

Add:

| Variable Name | Value |
|--------------|-------|
| `BACKEND_URL` | `https://your-project-name.shuttle.app` |

6. Click "Save"

### Step 4.2: Redeploy Frontend

1. Go to "Deployments" tab
2. Find your latest deployment
3. Click the three dots menu (⋮)
4. Click "Retry deployment"

Or push any change to trigger a new build:

```bash
cd frontend
git commit --allow-empty -m "Trigger redeploy"
git push
```

### Step 4.3: Deploy Dashboard (Optional)

The dashboard lets you manage projects and certificates.

1. In Cloudflare Pages, create a new project
2. Connect the same repository
3. Use these build settings:

| Setting | Value |
|---------|-------|
| Build command | `cd dashboard && pnpm install && pnpm build` |
| Build output directory | `dashboard/.next` |

4. Add environment variables:

| Variable Name | Value |
|--------------|-------|
| `BACKEND_URL` | `https://your-project-name.shuttle.app` |
| `NODE_VERSION` | `18` |

5. Deploy

### Step 4.4: Add Your First Project

1. Visit your dashboard URL
2. Sign in with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` from Secrets.toml
3. Click "Projects" → "Add Project"
4. Fill in project details
5. Save

Your project now appears on the frontend.

---

## Troubleshooting

### Frontend won't build

**Error: "Module not found"**
```bash
cd frontend
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Error: "Build timeout"**
- Cloudflare has a 20-minute build limit
- Make sure you're running `pnpm install` in the build command

### Backend won't deploy

**Error: "Secrets.toml not found"**
- Make sure `Secrets.toml` exists in the `backend/` folder
- Check file permissions

**Error: "MongoDB connection failed"**
- Verify your connection string is correct
- Check that "Allow Access from Anywhere" is enabled in MongoDB Atlas
- Make sure your password doesn't contain special characters that need escaping

### Can't login to dashboard

**Error: "Invalid credentials"**
- Make sure email and password match exactly what's in `Secrets.toml`
- Check there are no extra spaces

**Error: "Token expired"**
- Clear browser localStorage
- Login again

---

## Custom Domain (Optional)

### For Cloudflare Pages

1. Go to your project in Cloudflare Pages
2. Click "Custom domains"
3. Click "Set up a custom domain"
4. Enter your domain (e.g., `portfolio.yourdomain.com`)
5. Follow the DNS instructions

### For Shuttle.rs

Shuttle provides `.shuttle.app` domains by default. For custom domains:

1. Add to your `Shuttle.toml`:
```toml
name = "your-project-name"

[deploy]
custom_domain = "api.yourdomain.com"
```

2. Add a CNAME record pointing to your Shuttle URL

---

## What's Next?

- [ ] Add your projects through the dashboard
- [ ] Customize the landing page text in `frontend/app/(landing)/`
- [ ] Add your certificates
- [ ] Set up a custom domain
- [ ] Share your portfolio

---

## Quick Reference

| Service | URL |
|---------|-----|
| Frontend | `https://your-project.pages.dev` |
| Backend | `https://your-project.shuttle.app` |
| Dashboard | `https://your-dashboard.pages.dev` |
| GitHub Repo | `https://github.com/YOUR-USERNAME/my-portfolio` |

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Run frontend locally |
| `cargo shuttle run` | Run backend locally |
| `cargo shuttle deploy` | Deploy backend |
| `git push` | Trigger Cloudflare rebuild |
