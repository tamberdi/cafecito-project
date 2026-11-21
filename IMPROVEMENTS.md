# Cafecito: Improvements and Release Readiness

A review of the current codebase (server controllers, schema, routes, client API layer, context, `App`, `Dashboard`, `SessionHistory`; `Browse`, `Profile`, `PartnerProfile` and the README were only skimmed). The app was not run.

## 1. Blockers: you can't release without these

### No authentication (the biggest problem)
- The client picks who it is through `DemoUserSwitcher` and stores a `userId` in localStorage. The server trusts whatever ID a request carries.
- Anyone can `PATCH /users/5`, `DELETE /sessions/12`, or `PATCH /partnerships/3 {status:"active"}` for any user.
- `/users` returns every user's email to anyone (`browseUsers` returns whole user rows).
- `createPartnership`, `createReport`, `createBlock` and `createLanguage` take the acting user's ID from the request body, so it can be forged.

**Fix:**
- Add real sign-up and login. Options: Clerk, Auth.js or Supabase Auth, or JWT in httpOnly cookies plus bcrypt/argon2 if you want to own it. Hosted options also give email verification and password reset.
- Add an `authenticate` middleware that sets `req.user`. Drop every `userId` / `reporterId` from request bodies and use `req.user.id`.
- Add ownership checks:
  - A user may only update their own profile and languages.
  - Only partnership members may read or log sessions.
  - Only the recipient (`userB`) may accept or decline a request; only a member may end one.
- Remove `DemoUserSwitcher` from production, or gate it behind `import.meta.env.DEV`.

### Server hardening
- `cors()` is wide open. Restrict it to your Vercel origin.
- Add `helmet` and `express-rate-limit` (writes and login).
- Add input validation with `zod`. `parseInt(id)` can return `NaN`, which becomes a 500. There are no email-format or length checks, and `sessionDate` isn't validated as a date.
- Add a global error handler and a 404 handler.
- Read `PORT` and `FRONTEND_URL` from env, and fail fast on missing env vars such as `DATABASE_URL`.
- Clean up:
  - `server/index.js` imports `sessions` but never uses it.
  - `server/server@1.0.0` is a stray file (probably an accidental `npm` redirect). Delete it.
  - Move `check-db.mjs` and `list-tables.mjs` into `scripts/`.
  - The Drizzle `db` instance is recreated in every controller. Export it once from `db/connection.js`.

## 2. Bugs and logic problems

- **Blocks aren't enforced everywhere.**
  - Blocked users are filtered out of Browse, but `PartnerProfile` and `GET /users/:id` still load a blocked user's profile.
  - Blocking doesn't end an existing partnership, and a blocked partner can still log sessions.
  - There's a stale `TODO ... issue #13` in `createPartnership` even though the block check below it already exists.
  - Block and report should also be possible from the Dashboard partner card.
- **Partnership status transitions aren't validated.** You can set `ended` back to `active`, accept your own outgoing request, or activate a declined one. Add a state machine: `pending → active | declined`, `active → ended`.
- **Re-requesting after a decline.** The duplicate check allows it, but `unique(userA, userB, matchDate)` throws on a same-day second request (a generic 500) and doesn't catch the reversed order (B→A). Use a normalized pair index (`LEAST/GREATEST`).
- **Streak calculation is wrong in several cases.**
  - `new Date("2026-11-15")` parses as UTC but `setHours` runs in local time, so streaks break across timezones. Compare plain `YYYY-MM-DD` strings, or use the user's stored `timezone`.
  - Future-dated sessions count. Reject future dates.
  - A negative `diffDays` is silently ignored.
- **N+1 and over-fetching.**
  - `getUser` fetches every session row to count them. Use `count(*)` with a join.
  - Dashboard fires one `/streak` request per partnership. Include the partner's name and the streak in `GET /partnerships/user/:id`.
  - `SessionHistory` fires one `/topics/session/:id` per session. Include topics in `GET /sessions/partnership/:id`.
- **`browseUsers` loads the whole users table and filters in JS.** Do it in SQL with a join, and add pagination. `native` / `learning` also match case-sensitively ("Spanish" vs "spanish"). Normalise languages, ideally with a lookup table or ISO codes.
- **Dashboard shows "Partner: User #7"** instead of a name. It's the most visible rough edge.
- **`SessionHistory` needs `?partnershipId=X` typed into the URL.** Make it a real route such as `/partnerships/:id/sessions`. Sessions are also returned unordered; sort by date descending.
- **Dashboard's `error` state replaces the whole page**, so one failed call hides everything.
- **Missing indexes** on foreign keys: `partnerships.user_a_id/user_b_id`, `sessions.partnership_id`, `languages.user_id`, `session_topics`.
- **Missing uniqueness:** add `unique(session_id, topic_id)` (the same topic can be tagged twice) and `unique(user_id, language)` on languages.
- **Report spam.** One user can file unlimited reports against the same person. Add a rate limit or uniqueness rule.
- **Deleting a user cascades to everything**, including a partner's session history. Decide between soft delete and an account-deletion flow.
- **Seed and migrations.** Make sure production never runs `db:seed`. Only one migration exists, so keep the schema and migrations in sync.

## 3. Product enhancements

1. **Better matching.** Add mutual matches (native in what I'm learning *and* learning what I speak) as a "Best matches" sort or badge. Show timezone overlap and filter by level.
2. **Notifications.** Start with an in-app badge on Nav and a pending-requests count. Email on a new request is phase 2.
3. **Messaging or a scheduling hook.** At minimum, let matches share a contact method (Discord, WhatsApp, Meet link) after accepting. In-app chat can wait.
4. **Richer session logs.**
   - Edit sessions (the `PATCH` endpoint exists but there's no UI).
   - Add a "what we practiced / new words" field.
   - Add a per-session language field.
   - Add total time practiced and sessions this month to the Dashboard.
   - Offer topic suggestion chips from the most-used topics.
5. **Shared-session rules.** Decide whether a session needs confirmation by the other partner. Right now either person can delete the other's logs.
6. **Onboarding.** Landing → sign up → add at least one native and one learning language → Browse. New users currently get empty states with no guidance.
7. **Profile:** bio, interests, photo, "what I'm looking for".
8. **Streak copy.** The README promises a low-pressure framing, but "day streak" is classic gamification. Consider weekly goals or "weeks with a session". Define what happens to a streak when a partnership ends.

## 4. Frontend quality

- **Data fetching:** every page hand-rolls `useEffect` with loading/error state, and there are no loading states at all. Add TanStack Query for caching, refetching and optimistic updates.
- **Error handling:** empty `catch {}` blocks swallow errors (e.g. `DemoUserSwitcher`, language and topic fetches). Add a toast system and a top-level error boundary.
- **Route protection:** add a `<RequireAuth>` wrapper that redirects to login, instead of each page rendering its own "choose a demo user" message.
- **Missing pages:** a 404 route, and a UI to view and unblock blocked users (the API exists).
- **Accessibility:**
  - The Dashboard modal has no focus trap, Escape handler or `role="dialog"`.
  - Inputs rely on placeholders instead of `<label>`s.
  - Delete has no confirmation, so a session log can be lost in one click.
  - Check contrast on the grey text.
- **Components:** extract the modal, the session form and the partner card. Dashboard's "Log session" form and SessionHistory's "Log a Session" form are near-copies.
- **Configuration:**
  - `VITE_API_URL` is undefined if unset, so requests go to `"undefined/users"`. Fail loudly or default to `/api`.
  - Add a `.env.example` for client and server.
  - Add a proper title, meta description and OG tags in `index.html`.
- **Mobile:** check the modal and the fixed Demo box overlapping `Nav` on small screens.

## 5. Release readiness checklist

- [ ] **Tests:** none exist. Start with server integration tests (Vitest and supertest against a test DB) for partnerships, streak logic and auth/ownership, then one Playwright smoke test of the main flow.
- [ ] **CI:** GitHub Actions running lint, tests and `vite build` on every PR.
- [ ] **Linting/formatting:** add ESLint to the server and Prettier on both sides. Indentation and quote style are currently mixed.
- [ ] **Migrations in deploy:** run `drizzle-kit migrate` as a deploy step.
- [ ] **Logging/monitoring:** replace `console.error` with `pino`, add Sentry on client and server, and add a `/health` endpoint.
- [ ] **Legal and trust:** privacy policy, terms of service, and a minimum-age check at sign-up (consider 18+). Add account deletion and data export (GDPR).
- [ ] **Moderation:** an admin view or an email alert for the `reports` table.
- [ ] **README:** replace the placeholder live demo link and screenshot, add setup and deployment instructions, and consider moving the "Three ideas I'd build next" section out of the public README.
- [ ] **Backups:** enable automated Postgres backups.
- [ ] **Cold starts:** add a loading state for slow first requests on free-tier hosting.

## Suggested order

1. **Auth and ownership checks**, plus CORS, validation and rate limiting. Everything else builds on this.
2. **Data bug fixes:** streak, partnership transitions and uniqueness, N+1 queries, blocks enforced across the app.
3. **UX polish:** partner names on the Dashboard, a proper sessions route, loading/error/empty states, delete confirmations.
4. **Matching and notifications.**
5. **Tests, CI, Sentry and legal pages**, then release.
