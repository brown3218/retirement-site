# Retirement Site

## Prerequisites
- Node.js 20+
- npm 10+
- PostgreSQL database (Neon recommended)

## Environment Setup
1. Copy `.env.example` to `.env` and set `DATABASE_URL` to your Neon connection string. Format: `postgresql://USER:PASSWORD@HOST:PORT/DB?sslmode=require`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run Prisma migrations and generate the client:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```

## Prisma Commands
- `npx prisma generate` – regenerate Prisma Client
- `npx prisma migrate dev --name <migration-name>` – create/apply migrations locally
