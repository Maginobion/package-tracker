# 📦 Package Tracker

Full-stack application for tracking package shipments with real-time status updates and automated monitoring.

## 🚀 Quick Start

```bash
# 1. Start the database
cd api/.infra/database && docker-compose up -d

# 2. Start the API (terminal 1)
cd api && pnpm install && pnpm dev

# 3. Start the UI (terminal 2)
cd ui && pnpm install && pnpm dev
```

Access the application at `http://localhost:5173`

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + TypeScript + PostgreSQL
- **Features**: JWT Auth, Role-based access, Cron jobs, Unit tests, File logging

## 📁 Project Structure

- **`/api`** - Backend API ([README](api/README.md))
- **`/ui`** - Frontend React app ([README](ui/README.md))
- **`/common`** - Shared TypeScript types

## 📚 Documentation

- [API Documentation](api/README.md) - Complete backend setup and API reference
- [UI Documentation](ui/README.md) - Frontend setup and development guide
