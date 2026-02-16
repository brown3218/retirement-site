# Project Engineering Rules

This document defines hard requirements for the retirement-site project. All contributors must follow every rule below.

1. **Runtime & Hosting**: Ship as a Next.js App Router project deployed on Vercel. Do not introduce alternative frameworks or hosting assumptions.
2. **Finance Logic Boundary**: All calculation, projection, or financial modeling logic must live under `lib/finance-engine/**` as pure TypeScript functions. These modules must be covered by unit tests that run locally (e.g., via `npm test` when added). UI layers may only call these exported helpers.
3. **UI Layer**: Components (including `app/**` routes) must not embed financial formulas or business rules. They should accept props/results returned from the finance engine and handle rendering/state only.
4. **Scenario Data**: Every saved or default scenario must come from versioned JSON files/objects that include a `schemaVersion` property for migration safety.
5. **Data Layer**: Use Postgres (Neon) through Prisma. Any schema change requires a Prisma migration checked into the repo. Never bypass Prisma for database access.
6. **Auth**: Sessions and OAuth flows must use Auth.js. Support a credentials-based login that stores hashed passwords (e.g., bcrypt) before authentication.
7. **UI Dependencies**: Do not add external UI libraries (component kits, CSS frameworks) beyond what ships with Next.js/Tailwind already configured in this repo.
8. **Dev Reliability**: `npm run dev` must succeed with zero runtime errors before pushing any change; this command is the canonical local dev server invocation.

## Development Commands
- Start dev server: `npm run dev`
