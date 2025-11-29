# Open Portfolio Stack

A modern, full-stack portfolio solution with AI-powered chat, built with Rust and Next.js.

## Features

- **AI Chat**: RAG-enabled chat using Google Gemini to answer questions about your portfolio
- **Projects Showcase**: Display your projects with descriptions, technologies, and links
- **Certificates Display**: Showcase your certifications and credentials
- **Admin Dashboard**: Manage projects and certificates through a clean admin interface
- **Fallback Data**: Works out-of-box with demo data when database is not configured
- **Dark Mode**: Full dark/light theme support
- **Responsive Design**: Works on all device sizes

## Tech Stack

### Backend
- **Rust** with Axum web framework
- **MongoDB** for data storage
- **Google Gemini API** for AI chat
- **JWT Authentication** for admin access
- **Shuttle.rs** for deployment

### Frontend
- **Next.js 15** with App Router
- **React 19**
- **Tailwind CSS** for styling
- **Framer Motion** for animations

### Dashboard
- **Next.js 15**
- **JWT Authentication** (email/password)
- **Shadcn/ui** components

## Quick Start

### Prerequisites
- Rust (latest stable)
- Node.js 20+
- pnpm
- MongoDB Atlas account (optional - has fallback data)
- Google Cloud account (for Gemini API)

### 1. Backend Setup

```bash
cd backend

# Copy secrets template
cp Secrets.example.toml Secrets.toml

# Edit Secrets.toml with your values:
# - MONGODB_URI: Your MongoDB connection string
# - ADMIN_EMAIL: Admin email for dashboard login
# - ADMIN_PASSWORD: Admin password for dashboard login
# - JWT_SECRET: Secret key for JWT tokens
# - GOOGLE_API_KEY: Gemini API key from https://aistudio.google.com

# Run locally
cargo shuttle run

# Deploy to Shuttle
cargo shuttle deploy
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your values
# Note: Frontend works without BACKEND_URL using fallback data

# Run development server
pnpm dev
```

### 3. Dashboard Setup

```bash
cd dashboard

# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your values

# Run development server
pnpm dev
```

## Configuration

### Environment Variables

#### Backend (Secrets.toml)
```toml
MONGODB_URI = "mongodb+srv://..."
ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "your-secure-password"
JWT_SECRET = "your-jwt-secret-minimum-32-chars"
GOOGLE_API_KEY = "your-gemini-api-key"
```

#### Frontend (.env.local)
```env
# Backend URL (optional - uses fallback data if not set)
BACKEND_URL=https://your-backend.shuttle.app

# Site Configuration
NEXT_PUBLIC_OWNER_NAME="Your Name"
NEXT_PUBLIC_SITE_NAME="My Portfolio"
NEXT_PUBLIC_SITE_DESCRIPTION="Personal portfolio"
NEXT_PUBLIC_GITHUB_URL="https://github.com/username"
NEXT_PUBLIC_LINKEDIN_URL="https://linkedin.com/in/username"
```

#### Dashboard (.env.local)
```env
# Backend URL (required for dashboard)
BACKEND_URL=https://your-backend.shuttle.app
```

### Customizing Your Portfolio

1. **Site Config**: Edit `frontend/config/site.ts` for branding
2. **Fallback Data**: Edit `frontend/lib/data/fallback.ts` for demo projects
3. **Chat Prompts**: Customize in `frontend/config/site.ts`

## Project Structure

```
public-portfolio/
  backend/              # Rust Axum API
    src/
      api/              # API routes (projects, certificates, chat)
      auth/             # JWT authentication
      database/         # MongoDB client
      models/           # Data models
    Cargo.toml
    Secrets.example.toml
    
  frontend/             # Next.js public site
    app/
      (landing)/        # Home page
      Ask-Username/     # AI chat page
      about/            # About page
      projects/         # Projects listing
      contact/          # Contact form
    config/
      site.ts           # Site configuration
    lib/
      data/
        fallback.ts     # Demo data for projects/certificates
    
  dashboard/            # Next.js admin panel
    src/app/
      (authenticated)/
        projects/       # Manage projects
        certificates/   # Manage certificates
      sign-in/          # Login page
```

## Authentication

The dashboard uses JWT authentication:

1. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in backend's `Secrets.toml`
2. Access dashboard at `/sign-in`
3. Login with your admin credentials
4. JWT token is stored in browser and sent with API requests

## API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/v1/projects` | GET | No | List all projects |
| `/api/v1/projects/:slug` | GET | No | Get single project |
| `/api/v1/projects` | POST | Yes | Create project |
| `/api/v1/projects/:slug` | PUT | Yes | Update project |
| `/api/v1/projects/:slug` | DELETE | Yes | Delete project |
| `/api/v1/certificates` | GET | No | List all certificates |
| `/api/v1/certificates/:slug` | GET | No | Get single certificate |
| `/api/v1/certificates` | POST | Yes | Create certificate |
| `/api/v1/chat` | POST | No | AI chat endpoint |
| `/auth/login` | POST | No | Admin login |
| `/auth/verify` | GET | Yes | Verify JWT token |
| `/health` | GET | No | Health check |

## Deployment

### Backend (Shuttle.rs)
```bash
cd backend
cargo shuttle deploy
```

### Frontend (Vercel/Cloudflare)
```bash
cd frontend
pnpm build
# Deploy via platform dashboard
```

### Dashboard (Vercel/Cloudflare)
```bash
cd dashboard
pnpm build
# Deploy via platform dashboard
```

## Fallback Mode

The frontend works without a database connection:

1. If `BACKEND_URL` is not set, the frontend uses demo data
2. Demo projects and certificates are in `frontend/lib/data/fallback.ts`
3. Customize the fallback data to show your own demo content
4. This allows you to preview the site before setting up the backend

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
