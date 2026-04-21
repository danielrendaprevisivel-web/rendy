# External Integrations

**Analysis Date:** 2026-04-17

## APIs & External Services

**AI / Language Model:**
- Google Gemini (`gemini-2.5-flash`) — generates all bot responses in the conversational flow
  - Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
  - Auth: query param `?key=GEMINI_API_KEY` (server-side only; key never exposed to client)
  - Called from: `api/chat.js` (lines 35-42)
  - Payload format: `{ system_instruction, contents, generationConfig: { maxOutputTokens: 1000 } }`
  - Response extraction: `candidates[0].content.parts[0].text`

**Fonts:**
- Google Fonts CDN — Cormorant Garamond + Inter typefaces
  - URL: `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:...&family=Inter:...`
  - Loaded from: `public/index.html` (line 7)
  - No auth required

## Data Storage

**Databases:**
- Supabase (PostgreSQL) — user account store; no application data tables detected
  - Connection (server): `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` env vars
  - Connection (client): `SUPABASE_URL` + `SUPABASE_ANON_KEY` hardcoded in `public/index.html` (lines 204-205)
  - Server client: `createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })` in `api/chat.js` (lines 1-8)
  - Client SDK: jsDelivr CDN UMD bundle in `public/index.html` (line 142)

**File Storage:**
- Not used

**Caching:**
- None

## Authentication & Identity

**Auth Provider:**
- Supabase Auth — email/password authentication for student access control
  - Sign-in: `supabaseClient.auth.signInWithPassword({ email, password })` in `public/index.html` (line 312)
  - Session storage: `userSession = data.session`; access token used as `Authorization: Bearer` on every `/api/chat` request (line 534)
  - Token validation (server): `supabase.auth.getUser(token)` in `api/chat.js` (line 22); uses service role key to verify any user token
  - User management: manual only via Supabase dashboard (Authentication → Users → Add user); no self-signup flow

## Monitoring & Observability

**Error Tracking:**
- None — no Sentry, Datadog, or equivalent detected

**Logs:**
- `console.error()` calls in `api/chat.js` (lines 49, 58) for Gemini errors and fetch failures; logs surface in Vercel function logs dashboard

## CI/CD & Deployment

**Hosting:**
- Vercel — static files served from `public/`; serverless functions auto-detected from `api/*.js`
  - No build command
  - No framework preset (set to "Other")
  - Output directory: `public`

**CI Pipeline:**
- None detected (no GitHub Actions, CircleCI, etc.)

## Environment Configuration

**Required env vars (server-side — Vercel dashboard + `.env.local`):**
- `GEMINI_API_KEY` — Google AI Studio API key
- `SUPABASE_URL` — Supabase project URL (e.g. `https://<ref>.supabase.co`)
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role secret (never expose to client)

**Client-side (hardcoded in `public/index.html`):**
- `SUPABASE_URL` — same project URL; safe in frontend
- `SUPABASE_ANON_KEY` — anon/public key; safe in frontend

**Secrets location:**
- Server secrets: Vercel environment variables dashboard; locally via `.env.local` (gitignored)

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None — all external calls are request-response (Gemini REST API, Supabase Auth)

---

*Integration audit: 2026-04-17*
