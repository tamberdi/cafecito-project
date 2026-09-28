# Cafecito

*A language-exchange partner-matching app with per-partnership streak tracking, topic tagging, and a self-referencing partnership model.*

Most partner-matching apps default to identity verification and gamified streaks. Cafecito bets on the opposite: profile transparency over verification, and a low-pressure "quick coffee break" framing over drilling metrics.

I've spent over a decade teaching languages, and growing up in Mexico gave me a firsthand sense of what makes language learning feel accessible versus isolating. Cafecito is my attempt to build the tool I always wished existed.

**[Live demo →](#)**
**[Screenshot/GIF placeholder]**

**Stack:** React, Express, PostgreSQL, Drizzle ORM

---

### Three ideas I'd build next

- **"New faces" discovery filter** — surface partners you have no history with, raising a real question: should matching lean toward novelty or stay purely compatibility-driven?
- **Role-aware profile views** — a matched partner would see each other's language strengths/weaknesses, turning transparency from a trust signal into a coaching tool.
- **Motion as part of the tone** — small animated moments (a streak counting up, a session confirmation) to match the app's low-pressure feel, which currently swaps state instantly.

*(Full reasoning on each below.)*

---
---

## Features

**Baseline:** signup & profiles, language profiles, partner matching, partnership requests, session logging
**Custom:** streak tracking, duration validation, topic tagging, reporting & blocking

**Design principle:** profile transparency over anonymity — join date and session count, not identity verification.

## Schema

The interesting part is below: a self-referencing many-to-many partnership model, plus a genuine many-to-many topic-tagging system.

```
users ──┐
        ├── partnerships (user_a_id, user_b_id) — self-referencing
users ──┘

sessions ──── session_topics ──── topics
```

## A gotcha worth documenting

Drizzle wraps raw PostgreSQL errors inside `DrizzleQueryError` — the actual Postgres error code lives at `err.cause.code`, not `err.code`. Cost real time chasing a duplicate-key check that silently never triggered.

## Setup

```bash
git clone <repo-url>
cd cafecito
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

## Future Directions, in full

**"New faces" discovery filter.** Surface only partners you have no partnership or request history with, rather than repeatedly showing the same active users. Raises a real design question: should matching lean toward novelty (surfacing underconnected users) or stay purely compatibility-driven? Worth deciding deliberately rather than defaulting.

**Role-aware profile views.** A stranger sees the current transparency basics (join date, session count). A matched partner would see more — specifically each other's language strengths and weaknesses, so sessions can be structured around what each person actually needs to practice. Extends the app's transparency-over-anonymity principle from a trust signal into a coaching tool.

**Motion as part of the tone, not just polish.** The app currently swaps state instantly — a logged session, an updated streak, a page change all happen with no transition. Given the "quick coffee break" framing, small animated moments (a streak counting up, a session logging confirmation) would reinforce the low-pressure feel the app is going for, rather than motion for its own sake.