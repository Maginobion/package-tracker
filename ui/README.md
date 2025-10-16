# Package Tracker UI

Frontend web application built with React, TypeScript, and Vite for tracking package shipments.

## ✨ Features

- 🔍 Real-time package tracking by tracking number
- 📊 Package status visualization
- 📦 Detailed package information display
- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast development with Vite HMR (Hot Module Replacement)
- 🔄 React 19 with React Compiler
- 📱 Responsive design
- 🌐 RESTful API integration with Axios

## 🔧 Prerequisites

- **Node.js** >= 18.x
- **pnpm** >= 8.x (or npm/yarn)
- **Package Tracker API** running (see [api/README.md](../api/README.md))

## 📥 Installation

### 1. Navigate to the UI directory

```bash
cd package-tracker/ui
```

### 2. Install dependencies

```bash
pnpm install
```

## ⚙️ Environment Configuration

### 1. Create .env file (Optional)

Create a `.env` file in the UI directory if you need to override defaults:

```bash
touch .env
```

### 2. Configure environment variables (if needed)

```env
# API Base URL (optional - defaults to http://localhost:3000)
VITE_API_BASE_URL=http://localhost:3000
```

### Environment Variables

| Variable            | Description     | Default                 |
| ------------------- | --------------- | ----------------------- |
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:3000` |

**Note:** Vite requires environment variables to be prefixed with `VITE_` to be exposed to the client.

## 🚀 Running the Application

### Development Mode

```bash
pnpm dev
```

This will:

- Start the Vite development server
- Enable Hot Module Replacement (HMR)
- Run on `http://localhost:5173` by default

### Preview Production Build

```bash
# Build first
pnpm build

# Preview the build
pnpm preview
```

### Access the Application

Once running, the UI will be available at:

```
http://localhost:5173
```

**Important:** Make sure the API is running on `http://localhost:3000` before using the UI.

## 📜 Available Scripts

| Command        | Description                              |
| -------------- | ---------------------------------------- |
| `pnpm dev`     | Start development server with HMR        |
| `pnpm build`   | Build for production (TypeScript + Vite) |
| `pnpm preview` | Preview production build locally         |
| `pnpm lint`    | Run ESLint                               |

## 🏗️ Building for Production

### Build the application

```bash
pnpm build
```

This will:

1. Run TypeScript compiler (`tsc -b`)
2. Build optimized production bundle with Vite
3. Output to `dist/` directory

### Output Directory

```
dist/
├── assets/          # CSS, JS, and other assets
├── index.html       # Entry HTML file
└── ...
```

### Environment Variables for Production

Set `VITE_API_BASE_URL` to your production API URL:

```bash
# Build with production API
VITE_API_BASE_URL=https://api.yourcompany.com pnpm build
```

Or use a `.env.production` file:

```env
VITE_API_BASE_URL=https://api.yourcompany.com
```

## 📁 Project Structure

```
ui/
├── public/                 # Static assets
│   └── vite.svg
├── src/
│   ├── components/        # React components
│   │   └── PackageSearch/
│   │       └── PackageDetails.tsx
│   ├── config/           # Configuration files
│   │   └── axios.ts      # Axios instance configuration
│   ├── pages/            # Page components
│   │   └── index.tsx     # Home page
│   ├── services/         # API service layer
│   │   ├── index.ts
│   │   └── packageService.ts
│   ├── App.css           # App-specific styles
│   ├── App.tsx           # Root App component
│   ├── index.css         # Global styles (Tailwind)
│   └── main.tsx          # Application entry point
├── .env                  # Environment variables (create if needed)
├── .env.example          # Example environment variables
├── eslint.config.js      # ESLint configuration
├── index.html            # HTML template
├── package.json
├── tsconfig.app.json     # TypeScript config for app
├── tsconfig.json         # Base TypeScript config
├── tsconfig.node.json    # TypeScript config for Node
├── vite.config.ts        # Vite configuration
└── README.md
```

## 🛠️ Tech Stack

### Core

- **React 19** - UI library with latest features
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

### Styling

- **Tailwind CSS 4** - Utility-first CSS framework
- **@tailwindcss/vite** - Vite plugin for Tailwind

### HTTP Client

- **Axios** - Promise-based HTTP client

### Development Tools

- **ESLint** - Code linting
- **React Compiler** - Automatic React optimizations
- **TypeScript ESLint** - TypeScript-specific linting rules

### Build Tools

- **Vite** - Fast HMR and optimized builds
- **SWC** - Fast TypeScript/JavaScript transpilation
