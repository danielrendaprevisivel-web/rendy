# Testing Patterns

**Analysis Date:** 2026-04-17

## Test Framework

**Current Status:** No automated testing framework configured.

**Dependencies:**
- `package.json` contains only `@supabase/supabase-js` (^2.49.4)
- No test runner, assertion library, or E2E tool in dependencies

**Run Commands:**
- No test scripts defined in `package.json`
- No npm test runner configured

## Test File Organization

**Location:** Not applicable

**No test files present in the codebase:**
- No `*.test.js`, `*.spec.js` files found
- No `__tests__` directory
- No test configuration files (`jest.config.js`, `vitest.config.js`, `.testrc`)

## Test Structure

**Not applicable** — no test files exist.

## Mocking

**Not applicable** — no test files exist.

## Fixtures and Factories

**Not applicable** — no test files exist.

## Coverage

**Requirements:** None enforced

**Current coverage:** N/A (no tests)

## Test Types

### Unit Tests

**Coverage:** None

**Approach:** Not implemented

The codebase has no unit tests for:
- Client-side functions: `login()`, `callAPI()`, `addBubble()`, `renderSummary()`, etc.
- Server-side handler: `api/chat.js`

### Integration Tests

**Coverage:** None

**Approach:** Not implemented

No integration tests verify:
- Supabase authentication flow
- API proxy to Gemini
- Database persistence (`chat_history` table)

### E2E Tests

**Coverage:** None

**Framework:** Not used

**Manual Testing Approach:**

Since there are no automated E2E tests, testing is performed manually:

1. **Authentication Flow:**
   - Submit valid credentials → expect lock screen hidden, app visible
   - Submit invalid credentials → expect error message displayed

2. **Chat Interaction:**
   - Send message → expect bubble added to chat
   - Receive bot response → expect typing indicator then bot bubble
   - Progress bar updates → expect percentage and label change

3. **Summary Generation:**
   - Complete all 14 steps → expect `[RESUMO_COMPLETO]` JSON parsed
   - Summary panel renders → expect structured data display
   - Copy button → expect clipboard contains formatted summary

4. **Persistence:**
   - Refresh page → expect chat history restored
   - Return after logout → expect fresh start

5. **API Errors:**
   - Disconnect network → expect error bubble displayed
   - Invalid token → expect 401 response

6. **UI/UX:**
   - Responsive layouts on mobile (< 520px)
   - Input auto-resize functionality
   - Scroll behavior on chat

## Common Patterns

Since there are no test files, no patterns to document.

**Testable Function Examples (for future implementation):**

The codebase contains testable pure functions that could be unit tested:

```javascript
// extractSummary(text) - parses JSON from bot response
// cleanText(text) - removes summary from display
// mdToHtml(text) - converts markdown to HTML
// setProgress(step) - calculates percentage
```

**Recommendations for Testing:**

1. **Add Vitest:**
   ```bash
   npm install -D vitest @testing-library/dom jsdom
   ```

2. **Create test files:**
   - Test utility functions in isolation
   - Test component rendering with jsdom

3. **E2E with Playwright:**
   - Test full user flows from lock screen → summary
   - Configure in `vercel.json` or separate config

---

*Testing analysis: 2026-04-17*