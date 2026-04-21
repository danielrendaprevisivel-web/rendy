# Codebase Concerns

**Analysis Date:** 2026-04-17

## Security Considerations

**Hardcoded Supabase Credentials in Frontend**
- Files: `public/index.html` (lines 204-205)
- Risk: The `SUPABASE_URL` and `SUPABASE_ANON_KEY` are hardcoded in plain text in the frontend HTML. While the anon key is intended to be public, exposing the project URL helps attackers identify the Supabase project for enumeration attacks.
- Current mitigation: Using anon key (intended for public client usage)
- Recommendations: Consider using environment-based configuration or a build step to inject these values. However, for a static deployment, this is an acceptable trade-off as the anon key must be accessible to the client.

**Service Role Key Exposure**
- Files: `api/chat.js` (line 6)
- Risk: The `SUPABASE_SERVICE_ROLE_KEY` is used server-side. If the serverless function were misconfigured or the key leaked, it would provide full admin access to the Supabase project.
- Current mitigation: Key only exists in Vercel environment variables, never exposed to client
- Recommendations: Ensure the service role key is stored securely in Vercel secrets. Never commit `.env.local` to version control.

**No Input Validation on User Messages**
- Files: `public/index.html` (line 521-566)
- Risk: User messages are sent directly to the Gemini API without sanitization. While the system prompt instructs the AI to follow a structured flow, malicious input could potentially manipulate the model into generating harmful content or bypassing the conversation flow.
- Current mitigation: System prompt defines strict flow; no server-side validation
- Recommendations: Add input length limits client-side before sending to API.

**JWT Token Handling**
- Files: `public/index.html` (lines 534-535), `api/chat.js` (lines 17-25)
- Risk: The access token is stored in memory (`userSession.access_token`) and sent with every API request. If XSS existed, the token could be stolen. No token expiration handling is visible client-side.
- Current mitigation: Supabase handles token refresh; tokens stored only in memory, not localStorage
- Recommendations: Current approach is reasonable. Avoid adding token to localStorage.

## Performance Concerns

**No Request Timeout on API Calls**
- Files: `public/index.html` (lines 530-541)
- Risk: The `fetch()` call to `/api/chat` has no explicit timeout. If the serverless function or Gemini API is slow, the user could wait indefinitely (they see a "typing" indicator but no timeout error).
- Current mitigation: None visible
- Recommendations: Add an `AbortController` timeout (e.g., 30 seconds) to fail gracefully.

**Large History Payload**
- Files: `public/index.html` (lines 574-585)
- Risk: The `history` array grows with every message exchange. Each message contains Gemini-format objects with full text content. For long conversations, this could become a:
  - Network payload size issue (sent to Gemini on every request)
  - Database storage issue (stored in Supabase `chat_history` table)
- Current mitigation: None
- Recommendations: Consider:
  - Implementing a maximum history length (keep last N messages)
  - Compressing history before storing
  - Using a token budget instead of message count

**Summary JSON Parsing**
- Files: `public/index.html` (lines 367-371)
- Risk: The `extractSummary()` function uses a simple indexOf + JSON.parse approach. If the model outputs malformed JSON, it returns null silently. The summary panel simply won't render, but the conversation continues.
- Current mitigation: None - errors are swallowed
- Recommendations: Add try-catch with fallback UI message, or validate JSON schema before rendering.

## Reliability Concerns

**No Error Display for API Failures**
- Files: `api/chat.js` (lines 46-49), `public/index.html` (lines 561-565)
- Risk: API errors return generic "Erro ao obter resposta" or "Erro de conexão." There's no logging or feedback to the user about what went wrong (network error vs. API error vs. auth error).
- Current mitigation: None
- Recommendations: Display specific error messages from the API response when available.

**Chat History Load Race Condition**
- Files: `public/index.html` (lines 587-602)
- Risk: `loadHistory()` queries Supabase every time the app loads. There is no handling for:
  - Network failure during history load
  - Multiple browser tabs open (conflicting history)
  - history array being modified during iteration (lines 608-616)
- Current mitigation: None
- Recommendations: Add try-catch around the load, consider locking or optimistic updates for concurrent sessions.

**No Offline Handling**
- Files: `public/index.html` (entire app)
- Risk: The app requires constant connectivity. If network fails mid-conversation:
  - User loses their session state
  - No retry mechanism
  - No indication that they're offline
- Current mitigation: None
- Recommendations: Consider Service Worker for offline detection and basic feedback.

## Maintainability Concerns

**Monolithic Single-File Frontend**
- Files: `public/index.html` (647 lines)
- Risk: The entire frontend (HTML, CSS, JS, configuration) is in one 647-line file. This makes it difficult to:
  - Reuse components
  - Write unit tests
  - Onboard new developers
  - Refactor safely
- Current mitigation: Code is reasonably organized with sections
- Recommendations: For a simple chatbot, this is acceptable. If the app grows, consider splitting into separate files.

**System Prompt Embedded in Code**
- Files: `public/index.html` (lines 208-270)
- Risk: The ~60-line `SYSTEM_PROMPT` is hardcoded in the HTML file. Changes require editing the HTML and redeploying. There's no version control on the prompt itself.
- Current mitigation: None
- Recommendations: For production, consider storing prompts in a config file or database, or at least extracting to a separate JS file.

**Magic Strings and Hardcoded Values**
- Files: `public/index.html` (various)
- Risk: Values like "Erro ao obter resposta", "[RESUMO_COMPLETO]", error messages, and UI text are scattered throughout the code.
- Current mitigation: None
- Recommendations: Centralize strings in a constants object for easier maintenance and translation.

## Technical Debt

**No Automated Testing**
- Files: None (no test directory or test files found)
- Risk: There's no test coverage for:
  - Authentication flow
  - Chat message handling
  - Summary extraction and rendering
  - Error handling paths
- Current mitigation: None
- Recommendations: Add Jest or Vitest tests for core functions (extractSummary, cleanText, mdToHtml, etc.).

**No TypeScript or Type Checking**
- Files: All files are plain JavaScript
- Risk: Without type checking, refactoring is risky. Easy to introduce typos in property names (e.g., `step_count` vs. `stepCount`).
- Current mitigation: None
- Recommendations: Consider migrating to TypeScript for safer refactoring, especially for data handling functions.

**Debug Console Logs**
- Files: `public/index.html` (line 584)
- Risk: `console.error('saveHistory error:', error)` is the only logging. No structured logging for debugging production issues.
- Current mitigation: None
- Recommendations: Add a simple logging utility that can be toggled for development vs. production.

## Dependencies Risks

**Single Dependency: @supabase/supabase-js**
- Package: `@supabase/supabase-js@^2.49.4`
- Risk: Relying on a single library for both auth client and database operations. If the library has a security vulnerability or is deprecated:
  - No fallback option
  - Migration would require significant rewrites
- Current mitigation: Using official Supabase library
- Recommendations: Monitor library updates and security advisories. Pin to a specific version (currently using ^2.49.4 which allows minor updates).

**CDN Dependency for Supabase**
- Files: `public/index.html` (line 142)
- Risk: The Supabase library is loaded from jsDelivr CDN. If CDN is compromised or goes down:
  - App fails to load entirely
  - No auth or database functionality
- Current mitigation: None
- Recommendations: Consider bundling the library with a build step, or at least implement CDN failure detection with user-friendly message.

**No Lockfile**
- Files: No `package-lock.json` found
- Risk: Running `npm install` could pick up different patch versions of dependencies over time, causing inconsistent builds.
- Current mitigation: None
- Recommendations: Generate and commit `package-lock.json` to ensure reproducible builds.

---

*Concerns audit: 2026-04-17*