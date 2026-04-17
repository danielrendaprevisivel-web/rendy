# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Rendy** is a single-page chatbot for the "Renda Previsível" (RP) program. It guides enrolled students through a structured 5-step conversational flow to define their digital product, then renders a formatted summary. Deployed on Vercel with Supabase authentication and a serverless Gemini proxy.

## Architecture

```
rendy/
├── public/index.html   ← entire frontend (static, no build)
├── api/chat.js         ← Vercel serverless function (Gemini proxy)
├── package.json        ← only dep: @supabase/supabase-js (used by api/chat.js)
└── .env.local          ← server-side secrets for local dev (never commit)
```

### Request flow

1. **Lock screen** — `public/index.html` shows email/password form; calls `supabaseClient.auth.signInWithPassword()` using the Supabase CDN client. On success, stores `data.session` in `userSession`.
2. **Chat** — `startBot()` seeds `history` and calls `callAPI(null)`. Each subsequent user message calls `callAPI(text)`.
3. **`callAPI()`** — POSTs to `/api/chat` with `Authorization: Bearer ${userSession.access_token}` + Gemini-format payload `{ system_instruction, contents, generationConfig }`.
4. **`api/chat.js`** — validates the JWT via `supabase.auth.getUser(token)` (admin client, service role key), then proxies to `gemini-2.5-flash` using the server-side `GEMINI_API_KEY`. Returns `{ text }`.
5. **Summary** — the system prompt instructs the model to append `[RESUMO_COMPLETO]{...json...}` at the end of its step-5 reply. `extractSummary()` parses it; `cleanText()` strips it from the displayed message; `renderSummary()` builds the summary panel.

### Key state (`public/index.html`)

| Variable | Purpose |
|---|---|
| `userSession` | Supabase session object; `.access_token` sent as Bearer on every API call |
| `SUPABASE_URL` / `SUPABASE_ANON_KEY` | Hardcoded at top of `<script>` — must be real values before deploy |
| `SYSTEM_PROMPT` | Full bot persona + 5-step flow instructions |
| `STEPS_LABELS` / `TOTAL_STEPS` | 14-step progress bar labels |
| `history` | Gemini-format message history: `{ role: 'user'|'model', parts: [{ text }] }` |
| `stepCount` | Incremented per user message; drives progress bar |
| `summaryData` | Populated once `[RESUMO_COMPLETO]` JSON is received |

## Environment Variables

**Server-side** (Vercel dashboard + `.env.local` for local dev):

| Var | Where to get it |
|---|---|
| `GEMINI_API_KEY` | Google AI Studio |
| `SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → `service_role` key |

**Client-side** (hardcoded in `public/index.html`, lines ~204-205):

| Var | Where to get it |
|---|---|
| `SUPABASE_URL` | same as above |
| `SUPABASE_ANON_KEY` | Supabase → Settings → API → `anon / public` key |

The anon key is safe to expose in frontend code. The service role key must never leave the server.

## Vercel Deploy

No build step. Settings in Vercel dashboard:
- **Framework Preset:** Other
- **Root Directory:** *(empty — repo root)*
- **Build Command:** *(empty)*
- **Output Directory:** `public`

Vercel auto-detects `api/*.js` as serverless functions and serves `public/` at the root.

## User Management

Students are created manually in **Supabase → Authentication → Users → Add user**. There is no self-signup flow.

## Bot Persona Rules

- Address the student as **"RP"**
- No em-dashes (`—`), no double asterisks (`**`)
- One question per message
- Brazilian informal Portuguese
- 5-step flow order is mandatory: Nicho → Subnicho → Público (6 sub-questions) → Persona (5 sub-questions) → Análise Final

## Summary JSON Schema

The model emits this at the end of step 5:

```json
{
  "nicho": "...", "subnicho": "...",
  "publico": { "idade", "sexo", "localizacao", "pais", "profissao", "renda" },
  "persona": { "sonhos", "dores", "dificuldades", "crencas", "concreto" },
  "analise": { "validacao", "perfil_publico", "persona_descricao", "insight", "alerta" }
}
```

## Design System

CSS variables in `:root`: `--navy` (#0d1b2e), `--gold` (#c9a96e), `--gold-light` (#e2c48a), `--bg` (#f5f3ee). Fonts: **Cormorant Garamond** (headings, Google Fonts CDN), **Inter** (body). Bot bubbles: left-aligned white cards. User bubbles: right-aligned navy.
