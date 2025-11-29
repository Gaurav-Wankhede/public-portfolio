# Portfolio Dashboard

Admin dashboard for managing portfolio content (Projects & Certificates).

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: JWT (email/password)
- **Backend**: Rust API (Shuttle.rs)

## Quick Start

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start dev server
pnpm dev

# Visit http://localhost:3333
```

## Environment Variables

Create a `.env.local` file with:

```env
# Backend API URL (required)
BACKEND_URL=https://your-backend.shuttle.app

# Site URLs (for CORS)
NEXT_PUBLIC_SITE_URL=https://your-portfolio.com
NEXT_PUBLIC_DASHBOARD_URL=https://your-dashboard.com
```

## Authentication

The dashboard uses JWT authentication with credentials configured in the backend:

1. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your backend's `Secrets.toml`
2. Sign in at `/sign-in` with those credentials
3. JWT token is stored in localStorage and sent with API requests

## Features

- **Projects Management**: Create, edit, delete portfolio projects
- **Certificates Management**: Manage professional certifications
- **Dark/Light Theme**: Automatic theme detection
- **Responsive Design**: Works on all devices

## Project Structure

```
dashboard/
├── src/
│   ├── app/
│   │   ├── api/           # API proxy routes
│   │   ├── (authenticated)/ # Protected pages
│   │   │   ├── projects/
│   │   │   └── certificates/
│   │   └── sign-in/       # Login page
│   ├── components/        # UI components
│   └── lib/              # Utilities
├── .env.example          # Environment template
└── package.json
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm lint` | Run ESLint |

## Deployment

Deploy to any Node.js hosting platform:

1. Set environment variables in your hosting dashboard
2. Build command: `pnpm build`
3. Start command: `pnpm start`

## License

MIT
