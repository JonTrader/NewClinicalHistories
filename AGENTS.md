# NewClinicalHistories - agent notes

## Project overview

Dental clinical-records app for dentists and clinics. After register/login, a doctor manages their own patients, a tooth-by-tooth odontogram, and clinical evolution notes. Gemini powers keyword-to-note generation and a one-click history summary.

Monorepo (npm, Node 20+).

| Path | Role |
|---|---|
| `frontend/` | React 19 + Vite SPA, Zustand, Tailwind 4 + DaisyUI |
| `backend/` | Express 5 + TypeScript API, Mongoose 9, MongoDB |
| `docker-compose.yml` | Local: backend `:3000`, frontend nginx `:80` |
| `.github/workflows/` | `ci.yml` (PR tests), `deploy.yml` (main → ECR/EC2) |

**Stack highlights:** JWT in httpOnly cookie `jwt`; Arcjet on `/api/v1`; Cloudinary (clinic logo); Resend (welcome email); Gemini (`gemini-2.5-flash-lite`). UI clinical copy is Spanish; auth screens mix English.

**Domain:** `User` 1:N `Patient`; each `Patient` has 1:1 `Odontogram` and 1:1 `Evolution` (unique index on `patient`). Create/delete of the pair is transactional in `patient.controller.ts` via `Odontogram.createForPatient` / `Evolution.createForPatient` - not a Patient model hook. Factories seed 32 FDI teeth / empty `problemas` + null `tejidosBlandos`; evolution note `"Paciente creado"`.

**API entry:** `createApp()` in `backend/src/app.ts`; process entry `backend/src/index.ts` (`connectDB` + `listen`).

- `GET /api/health` → `{ status: 'ok' }` (no auth, no Arcjet)
- `/api/v1/auth`, `/patients`, `/odontograms`, `/evolutions`, `/ai` - Arcjet on all; patient-scoped routes use `protectRoute` + `isDoctor` (patient id in the path)

Frontend API base: `http://localhost:3000` in Vite dev, `/` otherwise (`frontend/src/lib/axios.js`).

## Build and test commands

Package manager: **npm** (`backend/package-lock.json`, `frontend/package-lock.json`). No root lockfile. CI uses `npm ci` + Node 20.

```bash
# Install
npm ci --prefix backend && npm ci --prefix frontend

# Dev (two terminals)
npm run dev --prefix backend    # tsx src/index.ts
npm run dev --prefix frontend   # vite

# Build / start
npm run build                   # root: install + build both
npm start                       # root: backend dist
npm run build --prefix backend  # tsc → dist/
npm run build --prefix frontend # vite build
npm run preview --prefix frontend

# Lint / typecheck
npm run lint --prefix frontend  # eslint . (frontend only)
# Backend: npm run build --prefix backend  (tsc; no separate typecheck script)
# Test types only: npx tsc -p backend/tsconfig.vitest.json

# Test
npm test                        # root: backend then frontend
npm test --prefix backend       # vitest run
npm test --prefix frontend      # vitest run
```

## Code style guidelines

- Prefer existing helpers under `backend/src/lib/`, `frontend/src/lib/`, and test helpers before adding new ones. Lean on project dependencies first.
- No Prettier/Biome. Do not add a formatter pass unless asked.
- **Backend:** TypeScript with `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`, `module`/`moduleResolution` `nodenext`. Use `.js` import specifiers in `.ts` files. Controllers `*.controller.ts`, routes `*.route.ts`, models singular (`patient.ts`). Named camelCase exports.
- **Frontend:** JavaScript (`.jsx`/`.js`), React 19, Zustand stores (`useXStore`), Axios via `ax` in `lib/axios.js`. Pages/components PascalCase default exports. Tailwind utilities + DaisyUI; theme tokens in `frontend/src/index.css` (`blueSteel`, `blueDeep`, `lightOcre`, etc.). Icons: `lucide-react`; toasts: `react-hot-toast`.
- ESLint is frontend-only (`frontend/eslint.config.js`). Backend has no lint script.
- Keep clinical UI and domain strings in Spanish (including `"Paciente creado"`). Do not translate Spanish field labels. API `message` strings are mostly English; auth UI is mixed - match the surrounding file.
- Patient updates must stay within `EDITABLE_PATIENT_FIELDS`; never set `doctor` except on create.

## Testing instructions

### Backend (Vitest + Supertest + MongoMemoryReplSet)

- App factory: `createApp()` - do not boot via `index.ts` in tests.
- Setup: `backend/src/__tests__/setup.ts` (env + mocks). Config: `backend/vitest.config.ts`.
- Helpers in `backend/src/__tests__/helpers/`:
  - `env.ts` - dummy env before app import
  - `mocks.ts` - Arcjet always `next()`; Resend, Cloudinary, `@google/genai`. Spies: `sendWelcomeEmailMock`, `cloudinaryUploadMock`, `generateContentMock`; `resetExternalMocks()`
  - `mongodb.ts` - `connectTestDB` / `clearTestDB` / `disconnectTestDB` (single-node replica set for transactions). **Never** use `connectDB()` in tests - it `process.exit(1)` on failure
  - `auth.ts` - `registerAndLogin` / `loginAs` (cookie `jwt`)
- Health test needs no Mongo. Integration tests: Mongo helpers + unique emails when clearing between cases.
- Gemini mock shape: `candidates[0].content.parts[0].text` (matches `ai.controller.ts`).
- `src/__tests__` excluded from production `tsc`. Editor/test types: `tsconfig.vitest.json` via `src/__tests__/tsconfig.json`. Vitest excludes `dist/**`.

### Frontend (Vitest + Testing Library + jsdom)

- Config: `frontend/vitest.config.ts`, setup `frontend/src/test-setup.js`.
- Tests under `frontend/src/__tests__/`.

### CI

PRs to `main` run `npm ci` + `npm test` in both packages (no lint/typecheck in CI). Fix failing or flaky tests you encounter, even if unrelated to your change.

## Security considerations

This app stores dental PHI (identity, contact, EPS, medical/dental history, odontogram, evolution notes). Use synthetic data in fixtures, tests, prompts, and commits.

- **Auth:** JWT (`userId`, 7d) in httpOnly cookie `jwt` (`sameSite: 'strict'`, `secure` in production). Do not weaken cookie flags, skip `protectRoute`/`isDoctor`, or return `password` from user queries.
- **Arcjet:** On every `/api/v1` router (shield LIVE, bot DRY_RUN, 50/60s). Search has a stricter limiter (30/60s). Fail-open on Arcjet errors. Do not remove Arcjet to make a request succeed.
- **Secrets:** Never commit `.env`, log secrets/JWTs/passwords/clinical bodies, or put secrets in the frontend.
- **CORS:** Credentials enabled for the configured client origin. JSON body limit 5mb. No Helmet today.
- **Cloudinary:** Clinic logo only (base64 in JSON). Do not route patient clinical images through it.
- **Gemini:** Sends evolution/keyword text to Google. Treat user text as untrusted (prompt injection). Do not add tools, system access, or extra PHI fields to prompts. Keep tests on mocks - no live Gemini/Cloudinary/Resend/Arcjet.
- **Tenancy:** List/search always filter `doctor: req.user._id`. Detail/edit/delete/odontogram/evolution/AI summary go through `isDoctor`.
