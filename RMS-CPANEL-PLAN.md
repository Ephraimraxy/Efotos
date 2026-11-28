# CSS RMS on cPanel – trial plan and scope
Prepared from: the css-rms repo (ARCHITECTURE.md, package.json, serve.js, schema) and your cPanel screenshots/Node.js page.

## 1. Verdict
Possible as a **trial**, not recommended as the production home. Production RMS stays on the InterServer VPS / Railway until the trial passes every gate in section 6.

## 2. What RMS needs vs what your cPanel has
| RMS needs | cPanel (cssgroup.com.ng) | Status |
|---|---|---|
| Node.js 20+ | Node 20.20, 22.23, 24.22 (recommended) | OK – use **24** (lockfile made with npm 11) |
| PostgreSQL 17 (Prisma, 24 migrations) | Only MySQL/MariaDB + phpMyAdmin. No PostgreSQL icon | **GAP** – database must be external |
| Always-running process (timers every 60 s: escalation, approval, stage; SMS balance alerts; WhatsApp/Baileys socket; heartbeat) | Passenger runtime; may stop an idle app | **RISK** – the main unknown |
| RAM for Express 5 + Prisma + sharp + Baileys | 1 GB for the whole account, shared with all sites; 100 processes, 20 entry processes | **TIGHT** |
| `sharp` native binary, Prisma engines | Linux/glibc, should install via npm | Likely OK, verify |
| Frontend build (Vite, 17 MB dist) | Too heavy for the account | Build on your computer, upload `dist` |
| File storage | Cloudflare R2 (external) | OK, unchanged |
| Terminal / SSH / Cron | Terminal, SSH Access, Cron Jobs present | OK |

## 3. Scope of the trial (in)
- A **separate test copy** at `rms-test.cssgroup.com.ng` (Node 24, application root `rms-test`, startup file `serve.js`).
- A **new, empty, separate** Postgres database (free tier of Neon/Supabase, or a scratch DB on the VPS). Seed data only; no live data.
- Test-only secrets (new `JWT_SECRET`, new super-admin code, `SIGNING_MASTER_KEY`). R2/SMS/email/OpenAI left unset or pointed at test accounts.
- Frontend built locally (`npm run build` in `rms_frontend`) and uploaded with the server code.

## 4. Out of scope
- Moving or copying production data. Changing production DNS (`cssgrouprms.com`). Touching the VPS, its PM2 or nginx. Any change to the live RMS.
- Rewriting RMS for MySQL.
- Never reuse production secrets in the test (the production `PIN`/signing keys and DB stay untouched).

## 5. Steps
1. **You:** create a free Postgres (Neon or Supabase) and give me nothing in chat – you will paste `DATABASE_URL` into the cPanel variables form yourself.
2. **Me:** prepare `rms-trial.zip` (server code, no `node_modules`, no `.env`) + built `dist`, and a `.env.example` for the test.
3. **You:** cPanel → Setup Node.js App → Create: version 24, mode production, root `rms-test`, URL `rms-test.cssgroup.com.ng`, startup `serve.js`. Add the variables from `.env.example`.
4. **You:** upload and extract the zip into `~/rms-test`.
5. **Terminal:** `npm ci --omit=dev`, `npx prisma generate`, `npx prisma migrate deploy`, `node rms_backend/prisma/seed.js`.
6. Restart the app from the Node.js page; open the URL; sign in with the test super-admin.

## 6. Pass/fail gates (all must pass to even consider more)
| Gate | Pass |
|---|---|
| Boots and survives restart | App starts, `/health`/login page loads, no crash loop |
| Stays awake | After 12 h idle, the 60-second timers still log/fire (check the log) |
| Memory | Stays under ~400 MB; cPanel "Resource Usage" shows no limit hits |
| Database latency | Typical page/API under ~1.5 s with the external DB |
| Requisition flow | Create → approve → pay on the test data works |
| WhatsApp (optional) | Session stays connected 24 h |
| Other sites | cssgroup.com.ng and subdomains unaffected (Resource Usage stays low) |

If any gate fails, stop: RMS stays on the VPS/Railway.

## 7. Risks and rollback
- Passenger sleep can silently stop the timers → the key test is gate 2.
- Memory/CPU limit hits could slow your other websites on the same account → watch Resource Usage; stop the app from the Node.js page at any time.
- Rollback = delete the Node.js app and the `rms-test` folder; nothing else was changed.

## 8. Recommendation
Keep production RMS on the VPS (or Railway). Use the cPanel for the PHP/static sites. Run this trial only if you want to cut the VPS cost; expect to need an external database either way.
