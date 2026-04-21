# Technology Stack

**Analysis Date:** 2026-04-17

## Languages

**Primary:**
- JavaScript (ES2020+) - All application code: frontend (`public/index.html`) and backend (`api/chat.js`)
- HTML5 - Single-page application shell and markup (`public/index.html`)
- CSS3 - Inline styles within `public/index.html`; uses CSS custom properties (`:root` variables)

## Runtime

**Environment:**
- Node.js - Serverless runtime on Vercel (version not pinned; no `.nvmrc` or `engines` field)

**Package Manager:**
- npm (inferred from `package.json` presence)
- Lockfile: absent (`package-lock.json` not committed)

## Frameworks

**Core:**
- None — frontend is a plain static HTML file with vanilla JavaScript; no frontend framework (no React, Vue, Svelte, etc.)

**Backend:**
- Vercel Serverless Functions — `api/chat.js` exports a standard `module.exports = async function handler(req, res)` compatible with Vercel's Node.js runtime

**Testing:**
- None — no test framework detected

**Build/Dev:**
- None — no build step; Vercel serves `public/` as static output and auto-detects `api/*.js` as serverless functions

## Key Dependencies

**Critical:**
- `@supabase/supabase-js` `^2.49.4` — used server-side in `api/chat.js` to validate user JWTs via `supabase.auth.getUser(token)` (admin/service-role client)

**Client-side CDN (not in package.json):**
- `@supabase/supabase-js@2` — loaded via jsDelivr CDN in `public/index.html` (line 142): `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js`; used for `signInWithPassword()` authentication

**Fonts (CDN):**
- Cormorant Garamond (400, 500, 600, 700) — headings; loaded from Google Fonts CDN
- Inter (300, 400, 500) — body text; loaded from Google Fonts CDN

## Configuration

**Environment:**
- Server-side vars set in Vercel dashboard and `.env.local` for local dev (never committed):
  - `GEMINI_API_KEY` — Google AI Studio API key
  - `SUPABASE_URL` — Supabase project URL
  - `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (server-only)
- Client-side vars hardcoded in `public/index.html` (lines 204-205):
  - `SUPABASE_URL` — duplicated; safe to expose
  - `SUPABASE_ANON_KEY` — public/anon key; safe to expose

**Build:**
- No build config files (`vercel.json`, `tsconfig.json`, `.babelrc`, etc. not present)
- Vercel settings configured via dashboard: Framework Preset = Other, Build Command = empty, Output Directory = `public`

## Platform Requirements

**Development:**
- Node.js (version unspecified)
- npm for installing `@supabase/supabase-js`
- `.env.local` with `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- Vercel CLI or Vercel dev server for local serverless function emulation

**Production:**
- Vercel (static hosting + serverless functions)
- No Docker, no container config detected

---

*Stack analysis: 2026-04-17*
