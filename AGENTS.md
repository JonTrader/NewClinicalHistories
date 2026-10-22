# NewClinicalHistories - agent notes

## Backend test suite

- App factory: `backend/src/app.ts` exports `createApp()`. Production entry `backend/src/index.ts` only calls `connectDB()` + `listen`.
- Public liveness: `GET /api/health` returns `{ status: 'ok' }` (no auth, no Arcjet, outside `/api/v1`).
- Vitest setup: `backend/src/__tests__/setup.ts` sets test env then loads mocks. Config: `backend/vitest.config.ts` `setupFiles`.
- Helpers under `backend/src/__tests__/helpers/`:
  - `env.ts` - dummy env vars before app import
  - `mocks.ts` - Arcjet middleware always `next()`, Resend, Cloudinary, `@google/genai`. Exported spies: `sendWelcomeEmailMock`, `cloudinaryUploadMock`, `generateContentMock`, plus `resetExternalMocks()`.
  - `mongodb.ts` - `mongodb-memory-server` via `connectTestDB` / `clearTestDB` / `disconnectTestDB`. Do **not** use `connectDB()` in tests; it `process.exit(1)` on failure.
  - `auth.ts` - `registerAndLogin` / `loginAs` Supertest agents that keep the `jwt` cookie
- Health test does not need Mongo; API integration tests should use the Mongo helpers and unique emails per test when clearing between cases.
- Gemini mock must return `candidates[0].content.parts[0].text` to match `ai.controller.ts`.
- `src/__tests__` is excluded from production `tsc` (`tsconfig.json`). Editor/typecheck for tests uses `tsconfig.vitest.json` via `src/__tests__/tsconfig.json` (`noEmit`). Vitest also excludes `dist/**` so compiled tests are never double-run.
