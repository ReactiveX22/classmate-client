# ClassMate Client

A Next.js frontend for the ClassMate application, a centralized academic platform for universities/colleges.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS 4, shadcn/ui
- **State:** TanStack Query, TanStack Table
- **Auth:** Better Auth
- **Forms:** TanStack Form + Zod validation
- **Real-time:** Socket.IO

## Prerequisites

- **Node.js 20+**
- **Backend server** running on port 3000 ([classmate-backend](https://github.com/ReactiveX22/classmate-backend))

## Quick Start

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env
   ```

   > **Note:** Make sure the backend server is running before starting the frontend.

3. **Start the development server**

   ```bash
   pnpm dev
   ```

   The app will be available at `http://localhost:3001`

## Common Commands

| Command        | Description                    |
| -------------- | ------------------------------ |
| `pnpm dev`     | Start dev server (watch mode)  |
| `pnpm build`   | Build for production           |
| `pnpm start`   | Run production build           |
| `pnpm lint`    | Run ESLint                     |

## CI/CD

Pushing to `main` automatically builds and publishes a Docker image to GitHub Container Registry (`ghcr.io`). Required secrets:

