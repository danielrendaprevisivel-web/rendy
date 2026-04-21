# Coding Conventions

**Analysis Date:** 2026-04-17

## JavaScript Patterns

### Naming Conventions

**Variables:**
- State variables use camelCase: `history`, `stepCount`, `done`, `summaryData`
- Boolean flags use descriptive names: `done`, `isVisible` (not detected, but pattern inferred)
- Underscore prefix for private/internal: not used (all state is module-level)

**Constants:**
- Uppercase with underscores: `SUPABASE_URL`, `SYSTEM_PROMPT`, `STEPS_LABELS`, `TOTAL_STEPS`
- Config values hardcoded at top: lines 204-205 in `public/index.html`

**Functions:**
- camelCase throughout: `login()`, `callAPI()`, `addBubble()`, `renderSummary()`
- Verb-first naming for actions: `saveHistory()`, `loadHistory()`, `setProgress()`
- Name reflects purpose: `extractSummary()`, `cleanText()`, `mdToHtml()`

**DOM Element References:**
- Stored as const at script top: lines 282-295 in `public/index.html`
- Names derived from ID: `lockEl`, `appEl`, `emailInput`, `passwordInput`
- No shorthand (e.g., `$lock` or `lock$`) - full descriptive names

### Code Structure

**Script Organization (public/index.html):**

```
Script order:
1. Constants & configuration (lines 203-278)
2. State variables (line 280)
3. DOM element references (lines 282-295)
4. Authentication functions (lines 297-328)
5. UI update functions (lines 330-386)
6. Summary rendering (lines 388-517)
7. API communication (lines 520-571)
8. Persistence (lines 573-624)
9. Event bindings (lines 627-644)
```

**Braces & Statements:**
- Opening brace same line: `if (condition) {`
- Single-line bodies still use braces: `if (!text) return;`
- No semicolons at line-end (optional in JS, omitted consistently)

**Async/Await:**
- Used for all API calls: Supabase auth, database, chat API
- try/catch wraps async operations
- Error handling shows user-friendly messages

### DOM Manipulation

**Element Creation:**
```javascript
const div = document.createElement('div');
div.className = 'bubble ' + role;
// appendChild for nested elements
```

**Element Access:**
- `document.getElementById()` for all selections (no querySelector)
- Cached at initialization (no repeated DOM lookups)

**Content Injection:**
- `innerHTML` for complex HTML strings
- `textContent` for plain text
- `innerHTML` with controlled data in render functions

### State Management

**Global State:**
- Module-level variables: `let history = [], stepCount = 0, done = false, summaryData = null, userSession = null`
- Single source of truth - no Redux/MobX
- State persists to Supabase (`saveHistory()` / `loadHistory()`)

## HTML Patterns

### Structure

**Semantic Elements:**
- `<div>` for all major sections (lock, app, header, chat, input-area, summary-panel)
- No `<main>`, `<section>`, `<article>` - simple div hierarchy

**IDs:**
- Unique IDs for stateful containers: `lock`, `app`, `chat`, `user-input`, `summary-panel`
- Consistent naming: `id="prefix-identifier"`

**Classes:**
- BEM-inspired but not strict: `.bubble`, `.bubble.bot`, `.bubble.user`
- Descriptive, not functional: `.lock-input-wrap`, `.header-left`
- State via class addition/removal: `.hidden`, `.visible`, `.show`, `.copied`

### Attributes

**Input Elements:**
- Semantic types: `type="email"`, `type="password"`
- Autocomplete attributes: `autocomplete="email"`, `autocomplete="current-password"`
- Placeholder text for hints

**Buttons:**
- No `type="button"` (default is submit in forms, but no form element here)
- Inline `onclick` for simple actions: line 194 `<button id="copy-btn" onclick="copySummary()">`

## CSS Patterns

### Custom Properties

**Color Palette (lines 10-21):**
```
--navy: #0d1b2e;
--gold: #c9a96e;
--gold-light: #e2c48a;
--gold-dim: rgba(201,169,110,0.13);
--bg: #f5f3ee;
--surface: #ffffff;
--text: #1a1a1a;
--muted: #7a7a7a;
--border: rgba(0,0,0,0.08);
--radius: 12px;
```

**Typography:**
- Font families via CSS variables not used - hardcoded in rules
- Font loading via Google Fonts CDN (line 7)

### Layout

**Flexbox:**
- Primary layout method: `#app { display: flex; flex-direction: column; }`
- Alignment: `align-items: center`, `justify-content: center`
- Gaps via `gap` property

**Spacing:**
- Numeric prefixes: `gap: 1.75rem;`, `padding: 1rem;`
- Consistent 0.5rem increments
- No spacing utility classes

### Animations

**Keyframes:**
- Inline in `<style>`:
```css
@keyframes fadeUp { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:translateY(0); } }
```
- Usage via `animation` property: `animation: fadeUp 0.22s ease;`

### Responsive

**Media Queries:**
- Mobile-first: `@media (max-width: 520px) { ... }`
- Grid column override: `.sum-grid { grid-template-columns: 1fr; }`

## API/Server Patterns (api/chat.js)

### Module Pattern

**Exports:**
- Single function export: `module.exports = async function handler(req, res) { ... }`

**Error Responses:**
- Consistent JSON structure: `{ error: '...' }`
- Proper HTTP status codes: 401, 400, 405, 500, 502
- Portuguese error messages

**Environment:**
- Server-side env vars via `process.env`: `SUPABASE_URL`, `GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- No runtime validation - fails at runtime if missing

### Request Handling

**Method Restriction:**
- Only POST allowed (lines 12-14)
- Returns 405 for other methods

**Authentication:**
- Bearer token in Authorization header (line 17)
- Token validation via Supabase admin client (line 22)

## Import Organization

**Order in api/chat.js:**
1. External dependencies: `require('@supabase/supabase-js')`
2. Configuration: env vars via `process.env`

**No path aliases used** - Node.js native requires

## Error Handling Patterns

### User-Facing Errors

**Display:**
- Error div with ID: `#auth-error`, `#error`
- Show/hide via CSS class: `classList.add('show')`, `classList.remove('show')`
- Timed display with transition

**Messages:**
- Specific: "Preencha e-mail e senha.", "E-mail ou senha incorretos."
- Generic for API: "Erro de conexão. Tente novamente."
- Never expose internal error details to users

### Logging

**Console:**
- `console.error()` only - not `console.log()` for errors
- Includes context: "saveHistory error:", error object
- Server-side: `console.error('Gemini error:', ...)`

### Try/Catch

**Pattern:**
```javascript
try {
  // async operation
} catch(e) {
  removeTyping();
  addBubble('Erro de conexão. Tente novamente.', 'bot');
  sendBtn.disabled = false;
}
```

## Comments

**Minimal:**
- No JSDoc comments detected
- Section dividers via comment:
```javascript
// ── Supabase ──
// ── LOGIN ──
// ── PROGRESS ──
```
- Bot persona in SYSTEM_PROMPT uses detailed comments structure

**Code Explanations:**
- Inline for non-obvious logic: "// bold", "// remove lone asterisks"
- No block documentation

---

*Convention analysis: 2026-04-17*