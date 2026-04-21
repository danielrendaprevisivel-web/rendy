# Codebase Structure

**Analysis Date:** 2026-04-17

## Directory Layout

```
rendy/
├── .planning/codebase/      # Documentation (generated)
├── public/                  # Static frontend assets
├── api/                     # Serverless functions
├── package.json             # Dependencies
├── .env.local               # Local secrets (not committed)
└── CLAUDE.md                # Project specification
```

## Directory Purposes

**`public/`:**
- Purpose: Static frontend files served at root
- Contains: HTML, CSS, JavaScript (all client-side)
- Key files: `index.html` (entire frontend)

**`api/`:**
- Purpose: Vercel serverless functions
- Contains: Node.js endpoint handlers
- Key files: `chat.js` (Gemini proxy)

**Root Level:**
- Purpose: Project configuration and documentation
- Contains: Package manifest, environment configs, specs

## Key File Locations

**Entry Points:**
- `public/index.html`: Main application (lock screen, chat, summary)
- `api/chat.js`: API endpoint handler

**Configuration:**
- `package.json`: npm dependencies and scripts
- `.env.local`: Local development secrets (GEMINI_API_KEY, SUPABASE_SERVICE_ROLE_KEY)

**Core Logic:**
- `public/index.html`: All frontend logic (550+ lines)
- `api/chat.js`: API proxy logic (~60 lines)

**Documentation:**
- `CLAUDE.md`: Project specification and architecture

## File Details

**`public/index.html`:**
- Lines: 550+
- Contains: Complete single-page application
  - CSS styles (design system with CSS variables)
  - HTML structure (lock screen, chat, summary panel)
  - JavaScript (all logic in one file)
- Key sections:
  - Design system (`:root` CSS variables for navy, gold, bg colors)
  - Fonts (Cormorant Garamond headings, Inter body)
  - State variables (userSession, history, stepCount, summaryData)
  - Functions (auth, chat, API calls, rendering)
  - System prompt (bot persona and 5-step flow)

**`api/chat.js`:**
- Lines: ~60
- Contains: Vercel serverless function
  - JWT validation via Supabase admin client
  - Gemini API proxy with system prompt
  - Error handling and response formatting

**`package.json`:**
- Dependencies: `@supabase/supabase-js` (single dependency)
- Purpose: Supabase client for authentication

**Root Files:**
- `CLAUDE.md`: Project specification (architecture, flow, env vars)
- `.env.local`: Local development secrets (GEMINI_API_KEY, SUPABASE_SERVICE_ROLE_KEY)

## Naming Conventions

**Files:**
- kebab-case for directories: `public/`, `api/`
- camelCase for JS: `chat.js`, `index.html`

**Variables (in index.html):**
- camelCase: `userSession`, `stepCount`, `summaryData`
- Constants: UPPER_SNAKE_CASE (`SUPABASE_URL`, `SYSTEM_PROMPT`)

## Where to Add New Code

**New Feature (Frontend):**
- Primary code: `public/index.html` (add to script section)
- State updates: Modify existing state variables

**New API Endpoint:**
- Implementation: Add new file in `api/` directory
- Follow pattern: `chat.js` for reference

**Utilities:**
- Shared helpers: Add to `public/index.html` script section
- Not separated (single-file frontend approach)

## Special Directories

**`.planning/codebase/`:**
- Purpose: Generated documentation files
- Generated: Yes (by GSD commands)
- Committed: Yes

**`public/`:**
- Purpose: Static assets served to users
- Generated: No
- Committed: Yes

**`.env.local`:**
- Purpose: Local development secrets
- Generated: No (created manually)
- Committed: No (in .gitignore)

---

*Structure analysis: 2026-04-17*