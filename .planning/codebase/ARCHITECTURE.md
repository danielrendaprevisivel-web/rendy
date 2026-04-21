# Architecture

**Analysis Date:** 2026-04-17

## Pattern Overview

**Overall:** Client-server architecture with serverless API proxy

**Key Characteristics:**
- Single HTML frontend (no build step, static deployment)
- Vercel serverless functions for API proxy
- Supabase for authentication and JWT validation
- Gemini API as LLM backend for chatbot

## Layers

**Frontend Layer:**
- Purpose: User interface and chatbot state management
- Location: `public/index.html`
- Contains: All UI, authentication, chat logic, state management
- Depends on: Supabase CDN client, Google Fonts
- Used by: End users (students)

**API Layer:**
- Purpose: Proxy requests to Gemini, validate JWT
- Location: `api/chat.js`
- Contains: Serverless function, JWT validation, Gemini API call
- Depends on: Supabase admin client, Gemini API
- Used by: Frontend via `/api/chat` endpoint

**External Services:**
- Purpose: Authentication, LLM generation
- Location: Supabase (auth), Google Gemini (AI)
- Contains: User credentials, session tokens, bot responses

## Data Flow

**Authentication Flow:**

1. User enters email/password on lock screen
2. `supabaseClient.auth.signInWithPassword()` validates credentials
3. Supabase returns session object with `access_token` (JWT)
4. `userSession` stores the session object
5. All subsequent API calls include `Authorization: Bearer ${userSession.access_token}`

**Chat Flow:**

1. User sends message in chat input
2. `callAPI(text)` posts to `/api/chat` with JWT in header
3. `api/chat.js` validates JWT via `supabase.auth.getUser(token)` using service-role key
4. Valid request forwards to Gemini API with system prompt + conversation history
5. Gemini returns response, `api/chat.js` returns `{ text }` to frontend
6. Frontend appends response to `history`, displays in chat bubble

**Summary Flow:**

1. At step 5 completion, Gemini appends `[RESUMO_COMPLETO]{...json...}` to response
2. `extractSummary()` parses the JSON from the response text
3. `cleanText()` removes the JSON marker from displayed message
4. `renderSummary()` builds the summary panel with parsed data
5. `summaryData` stores the parsed JSON for display

## Key State

**`userSession`:**
- Type: Supabase session object
- Purpose: Stores JWT access token for API authentication
- Key property: `.access_token` - sent as Bearer token on every `/api/chat` call

**`history`:**
- Type: Array of message objects
- Purpose: Gemini-format conversation history
- Structure: `[{ role: 'user'|'model', parts: [{ text: string }] }]`
- Used by: Sent to Gemini API on each request

**`stepCount`:**
- Type: Integer
- Purpose: Tracks conversation progress (1-14 for progress bar)
- Incremented: Per user message

**`summaryData`:**
- Type: Object
- Purpose: Stores parsed summary JSON from `[RESUMO_COMPLETO]`
- Fields: nicho, subnicho, publico, persona, analise

## Key Abstractions

**System Prompt:**
- Purpose: Defines bot persona and 5-step conversational flow
- Examples: Embedded in `public/index.html` as `SYSTEM_PROMPT` constant
- Pattern: Detailed instructions for Gemini model behavior

**Steps Labels:**
- Purpose: Maps stepCount to progress bar display
- Examples: `STEPS_LABELS` array in `public/index.html`
- Pattern: Array of 14 strings for progress bar

## Entry Points

**Lock Screen:**
- Location: `public/index.html` (initial view)
- Triggers: On page load if no valid `userSession` in localStorage
- Responsibilities: Email/password form, Supabase authentication

**Chat Interface:**
- Location: `public/index.html` (after auth)
- Triggers: After successful `signInWithPassword`
- Responsibilities: Message input, chat display, progress bar, summary panel

**API Endpoint:**
- Location: `api/chat.js`
- Triggers: POST requests from frontend
- Responsibilities: JWT validation, Gemini proxy, error handling

## Error Handling

**Authentication Errors:**
- Invalid credentials → Show error message on lock screen
- Expired JWT → Prompt re-login

**API Errors:**
- Gemini API failure → Return error to frontend, display in chat
- JWT validation failure → Return 401, frontend redirects to login

**Validation:**
- Required env vars checked at startup
- JWT validated on every API request before proxying

## Cross-Cutting Concerns

**Authentication:** Supabase email/password + JWT Bearer tokens
**State Storage:** localStorage for userSession persistence
**API Security:** Service-role key server-side only, never exposed to client

---

*Architecture analysis: 2026-04-17*