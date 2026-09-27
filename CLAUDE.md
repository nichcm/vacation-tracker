# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Vacation-tracking MVP: NestJS 12 + TypeORM + PostgreSQL 16 backend (`backend/`) and React 19 + Vite + Tailwind 4 + shadcn/ui + TanStack Query frontend (`frontend/`). Two independent npm projects; there is no root `package.json`. The README is in Portuguese and has full run instructions, seed users (password `ferias123`), and business rules.

## Commands

Full stack (Postgres + API in watch mode + Vite), from repo root:

```bash
docker compose up --build        # web :5173, API :3000/api, Swagger :3000/api/docs
docker compose down -v           # reset database
```

`backend/docker-compose.yml` and `frontend/docker-compose.yml` run each side alone; they share ports with the root compose, so never run both.

Backend (`cd backend`):

```bash
npm test                                   # Vitest, all src/**/*.spec.ts
npx vitest run src/features/vacations/request-vacation   # single slice / file
npx vitest run -t "rejeita sobreposição"   # single test by name
npm run lint                               # oxlint --type-aware (no-floating-promises is an error)
npm run format                             # prettier
npm run build && npm run seed              # seed and migration scripts run from dist/, so build first
npm run migration:run | migration:revert
```

Frontend (`cd frontend`): `npm run dev`, `npm run build` (runs `tsc -b` then Vite, so this is the type check), `npm run lint`. The frontend has no tests.

## Backend architecture: Vertical Slice

- Each use case lives in `src/features/<context>/<use-case>/` with its own `*.controller.ts`, `*.handler.ts` (business logic), `*.dto.ts`, `*.module.ts`, and `*.handler.spec.ts`. There are no global service or repository layers. Handlers inject `Repository<Entity>` directly via `TypeOrmModule.forFeature`. A new slice must be added to `imports` in `src/app.module.ts`.
- Only cross-cutting infrastructure goes in `src/shared/`: entities, auth, database config, clock, date utils. Response shapes shared by vacation slices live in `features/vacations/shared/vacation-view.ts` (`toVacationView`).
- **Auth is global.** `SharedAuthModule` registers `JwtAuthGuard` and `RolesGuard` as `APP_GUARD`, so every route requires a JWT unless it is marked `@Public()`. Use `@Roles(UserRole.MANAGER)` to restrict by role and `@CurrentUser()` to get the `AuthenticatedUser`. Needs the `JWT_SECRET` env var.
- **ESM with NodeNext**: relative imports must use the `.js` extension (`'../../shared/clock/clock.js'`).
- **Dates** are `AAAA-MM-DD` strings end to end (Postgres `date` columns, compared as strings). Use the helpers in `shared/dates/date-only.ts`. Never call `new Date()` in handlers; inject `Clock` (global module) and use `clock.today()` so tests can pin the date. Containers run with `TZ=America/Sao_Paulo`.
- **Migrations** are listed explicitly in `shared/database/database.config.ts`, not globbed, so a new migration must be added to that array. `synchronize` is off. The app runs pending migrations on boot (`migrationsRun: true`), and so does the seed. `data-source.ts` is the DataSource for the TypeORM CLI and the seed, which run outside Nest.
- A global `ValidationPipe` runs with `whitelist` + `forbidNonWhitelisted` + `transform`, so DTOs must declare every accepted field with class-validator decorators. Controllers carry Swagger decorators (`@ApiTags`, `@ApiBearerAuth`, response types).
- **Tests** are handler unit tests. They build the handler with `new`, passing mocked repos (`vi.fn()`, cast `as unknown as Repository<...>`) and a stub `Clock`. Vitest globals are enabled. No DB or Nest testing module is involved.

## Frontend architecture

- Code is organized by feature under `src/features/` (`auth/`, `vacations/{request,approvals,monthly,shared}`). Each feature has a `queries.ts` with TanStack Query hooks. Mutations invalidate the `['vacations']` key prefix.
- `src/lib/api.ts` is the only HTTP client. It always calls the relative path `/api/...` and attaches the JWT from localStorage. On a 401 it clears the token and fires the `onUnauthorized` listener. The Vite dev proxy (`VITE_API_PROXY_TARGET`) and nginx in prod (`API_UPSTREAM`, `nginx.conf.template`) forward `/api`, so the browser never needs CORS.
- Routes are in `App.tsx`: Portuguese paths `/ferias/mes`, `/ferias/solicitar`, and `/ferias/aprovacoes` (MANAGER only, guarded by `<ProtectedRoute roles={['MANAGER']}>`). Pages are lazy-loaded.
- The `@/` alias points to `src/`. `src/components/ui/` holds shadcn/ui components (style `radix-nova`); add more with the shadcn CLI rather than writing them by hand.
- Date formatting uses date-fns with the `ptBR` locale (`features/vacations/shared/dates.ts`).

## Conventions

- UI text, error messages, code comments, test names, and commit messages are in Brazilian Portuguese. Commits follow Conventional Commits (`feat(frontend): ...`, `build: ...`).
- Prettier differs per project. Backend: single quotes, semicolons, default width 80. Frontend: no semicolons, single quotes, width 120.
- Line endings are LF, enforced by `.gitattributes`.
