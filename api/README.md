# Package Tracker API

Backend API built with Express.js and TypeScript for tracking package shipments.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Scheduled Jobs](#scheduled-jobs)
- [Testing](#testing)
- [Project Structure](#project-structure)

## ✨ Features

- 📦 Package tracking and status management
- 🔐 JWT authentication with role-based access control
- 🗄️ PostgreSQL database with transactions
- 📊 Product and warehouse management
- ⏰ Automated cron jobs for stale package detection
- 📝 Comprehensive logging with file output
- ✅ Input validation with Zod
- 🔒 Password hashing with bcrypt
- 🧪 Unit testing with Jest

## 🔧 Prerequisites

- **Node.js** >= 18.x
- **pnpm** >= 8.x (or npm/yarn)
- **Docker** and **Docker Compose** (for PostgreSQL)
- **PostgreSQL** >= 15.x (if not using Docker)

## 📥 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd package-tracker/api
```

### 2. Install dependencies

```bash
pnpm install
```

## 🗄️ Database Setup

### Option 1: Using Docker (Recommended)

The easiest way to set up the database is using Docker Compose:

```bash
# Navigate to the database directory
cd .infra/database

# Start PostgreSQL container with migrations
docker-compose up -d --build

# Verify the database is running
docker-compose ps
```

This will:

- Create a PostgreSQL database
- Run all migrations automatically
- Seed initial data (roles, users, warehouses, products, packages)

### Option 2: Manual PostgreSQL Setup

If you have PostgreSQL installed locally:

```bash
# Create database
createdb package_tracker

# Run migrations manually
psql package_tracker < migrations/001-schema.sql
psql package_tracker < migrations/002-seed-data.sql
psql package_tracker < migrations/003-products-and-packages.sql
```

### Database Credentials (Default)

- **Host**: localhost
- **Port**: 5432
- **Database**: package_tracker
- **User**: postgres
- **Password**: postgres

## ⚙️ Environment Configuration

### 1. Create .env file

```bash
cp .env.example .env
```

### 2. Configure environment variables

Edit `.env` with your settings:

```env
# Application
APP_PORT=3000
NODE_ENV=development

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=package_tracker
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres

# JWT Authentication
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Jobs Configuration
STALE_PACKAGES_THRESHOLD_DAYS=3
RUN_JOBS_ON_STARTUP=false
```

### Important Variables

| Variable                        | Description                                     | Default                  |
| ------------------------------- | ----------------------------------------------- | ------------------------ |
| `APP_PORT`                      | Port for the API server                         | `3000`                   |
| `DATABASE_*`                    | PostgreSQL connection details                   | See above                |
| `JWT_SECRET`                    | Secret key for JWT tokens                       | ⚠️ Change in production! |
| `STALE_PACKAGES_THRESHOLD_DAYS` | Days before packages are flagged as stale       | `3`                      |
| `RUN_JOBS_ON_STARTUP`           | Run cron jobs immediately on startup (dev only) | `false`                  |

## 🚀 Running the Application

### Development Mode

```bash
pnpm dev
```

Runs with hot-reload using nodemon. Server will restart automatically on file changes.

### Production Mode

```bash
# Build the TypeScript code
pnpm build

# Start the production server
pnpm start
```

### Access the API

Once running, the API will be available at:

```
http://localhost:3000
```

Health check endpoint:

```
http://localhost:3000/api/health
```

## 📜 Available Scripts

| Command                   | Description                              |
| ------------------------- | ---------------------------------------- |
| `pnpm dev`                | Start development server with hot-reload |
| `pnpm build`              | Build TypeScript to JavaScript           |
| `pnpm start`              | Start production server                  |
| `pnpm lint`               | Run ESLint                               |
| `pnpm test`               | Run all tests                            |
| `pnpm test:watch`         | Run tests in watch mode                  |
| `pnpm test:coverage`      | Run tests with coverage report           |
| `pnpm job:stale-packages` | Manually run stale packages job          |

## 🌐 API Endpoints

### Authentication

```http
POST /api/auth/login
```

Login with email and password. Returns JWT token.

**Body:**

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Packages

All package endpoints require authentication.

```http
GET    /api/packages/:trackingNumber     # Get package by tracking number
POST   /api/packages                     # Create new package (admin only)
POST   /api/packages/:trackingNumber/ready-for-shipping    # Mark as ready
POST   /api/packages/:trackingNumber/in-transit            # Mark as in transit
POST   /api/packages/:trackingNumber/delivered             # Mark as delivered
POST   /api/packages/:trackingNumber/returned              # Return to warehouse
```

### Products

```http
GET    /api/products/:productId          # Get product details
POST   /api/products                     # Create new product
```

### Jobs

Admin only endpoints:

```http
GET    /api/jobs/stale-packages          # Get stale packages summary
POST   /api/jobs/stale-packages/trigger  # Manually trigger stale packages job
```

### Health Check

```http
GET    /api/health                        # Check API health
```

## ⏰ Scheduled Jobs

### Stale Packages Check

Runs **daily at 10:00 PM** automatically.

**What it checks:**

- Packages pending or ready for shipping for more than X days (configurable)
- Packages returned the same day and still not delivered

**Logs are written to:** `logs/stale-packages-{timestamp}.log`

**Manual execution:**

```bash
# Run with default threshold (3 days)
pnpm run job:stale-packages

# Run with custom threshold (5 days)
STALE_PACKAGES_THRESHOLD_DAYS=5 pnpm run job:stale-packages
```

**Configuration:**

Change the threshold in `.env`:

```env
STALE_PACKAGES_THRESHOLD_DAYS=5
```

## 🧪 Testing

### Run all tests

```bash
pnpm test
```

### Run tests in watch mode

```bash
pnpm test:watch
```

### Run tests with coverage

```bash
pnpm test:coverage
```

### Test files location

Tests are located in `src/**/__tests__/` directories.

Example: `src/packages/__tests__/packages.service.test.ts`

## 📁 Project Structure

```
api/
├── .infra/
│   └── database/              # Docker setup for PostgreSQL
│       ├── Dockerfile
│       └── docker-compose.yml
├── logs/                      # Job execution logs
├── migrations/                # Database migration scripts
│   ├── 001-schema.sql
│   ├── 002-seed-data.sql
│   └── 003-products-and-packages.sql
├── src/
│   ├── auth/                  # Authentication logic
│   │   ├── auth.controller.ts
│   │   ├── auth.dto.ts
│   │   ├── auth.routes.ts
│   │   └── auth.service.ts
│   ├── config/                # Configuration files
│   │   ├── config.ts
│   │   └── database.ts
│   ├── health/                # Health check endpoints
│   ├── jobs/                  # Cron jobs
│   │   ├── jobLogger.ts       # Logging utility
│   │   ├── scheduler.ts       # Job scheduler
│   │   ├── stalePackages.job.ts
│   │   └── stalePackages.service.ts
│   ├── middlewares/           # Express middlewares
│   │   ├── authMiddleware.ts  # JWT authentication
│   │   ├── errorHandler.ts
│   │   ├── roleMiddleware.ts  # Role-based access control
│   │   └── validateRequest.ts # Zod validation
│   ├── packages/              # Package management
│   │   ├── __tests__/         # Unit tests
│   │   ├── packages.controller.ts
│   │   ├── packages.dto.ts
│   │   ├── packages.helper.ts
│   │   ├── packages.repository.ts
│   │   ├── packages.routes.ts
│   │   └── packages.service.ts
│   ├── products/              # Product management
│   └── server.ts              # Express app entry point
├── .env                       # Environment variables (create from .env.example)
├── .env.example               # Example environment variables
├── jest.config.js             # Jest configuration
├── package.json
├── tsconfig.json              # TypeScript configuration
└── README.md
```

## 🔐 Default Test Users

The seed data includes these test users:

| Email                  | Password      | Roles                            |
| ---------------------- | ------------- | -------------------------------- |
| `admin@example.com`    | `password123` | admin, receiver, packer, carrier |
| `receiver@example.com` | `password123` | receiver                         |
| `packer@example.com`   | `password123` | packer                           |
| `carrier@example.com`  | `password123` | carrier                          |

## 🐳 Docker Commands

### Start database

```bash
cd .infra/database
docker-compose up -d
```

### Stop database

```bash
docker-compose down
```

### Reset database (delete all data)

```bash
docker-compose down -v
docker-compose up -d --build
```

### View database logs

```bash
docker-compose logs -f
```

## 🔍 Troubleshooting

### Database connection failed

1. Check if PostgreSQL is running:

   ```bash
   docker-compose ps
   ```

2. Verify database credentials in `.env`

3. Check if port 5432 is available

### Migration issues

Reset the database completely:

```bash
cd .infra/database
docker-compose down -v
docker-compose up -d --build
```

### Port already in use

Change `APP_PORT` in `.env`:

```env
APP_PORT=3001
```

### JWT authentication errors

Ensure `JWT_SECRET` is set in `.env` and is not empty.

## 📚 Additional Documentation

- **Cron Jobs**: See `src/jobs/` directory
- **Testing Guide**: See `src/packages/__tests__/README.md`
- **Repository Pattern**: See `src/packages/packages.repository.ts`

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `pnpm test`
4. Run linter: `pnpm lint`
5. Create a pull request

## 📄 License

[Add your license here]
