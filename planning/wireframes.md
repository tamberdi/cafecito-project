# Wireframes
 
Low-fidelity wireframes for Cafecito, designed mobile-first. Each page below includes the required screenshot/export placeholder — swap in actual exported images from Figma (or screenshots of the mobile-first mockups) once finalized.
 
## Pages included
 
1. Landing / Login
2. Browse Partners
3. Partner Profile
4. Dashboard (My Partnerships)
5. Session History / Log
6. My Profile / Settings
---
 
## 1. Landing / Login
 
Entry point for first-time visitors. Includes app name, tagline, log in / sign up buttons, and a row of three feature highlights (find a partner, log sessions, build a streak) to quickly communicate what the app does before signup.
 
![Landing page wireframe](placeholder.png)
 
**Notes:** Kept minimal — no functionality beyond auth entry points. Highlight row uses icon + short label + one-line description per feature.
 
---
 
## 2. Browse Partners
 
Mobile: single "Filters" button opens a sheet with language/timezone filters; partner cards stack in one column.
Desktop: filters shown inline as three dropdowns; partner cards in a grid.
 
![Browse Partners wireframe](placeholder.png)
 
**Notes:** Core discovery screen — supports user stories 4 and 5 (browsing and sending partnership requests). Each card links to the Partner Profile page.
 
---
 
## 3. Partner Profile
 
Shows a partner's languages (native/learning, proficiency level), timezone/availability, and a "Send partnership request" action. Also where profile transparency signals (join date, completed session count) will surface.
 
![Partner Profile wireframe](placeholder.png)
 
**Notes:** Design principle: profile transparency over anonymity — supports trust and safety without requiring full identity verification.
 
---
 
## 4. Dashboard (My Partnerships)
 
Mobile: partnership rows with a quick-log icon per row; tapping opens a bottom sheet to log a session without navigating away.
Desktop (two directions still under consideration):
- **Version A:** top nav, single global streak counter at the top, partnership list below.
- **Version B:** sidebar nav, per-partnership streaks shown directly on each partnership card, "+ Log session" as a persistent header action.
![Dashboard wireframe](placeholder.png)
 
**Notes:** Core daily-use screen. Supports user stories 7, 8, 9, 12. Decision on global vs. per-partnership streak still open — leaning toward whichever feels more consistent with the app's low-pressure tone.
 
---
 
## 5. Session History / Log
 
List of logged sessions, filterable by partner, date range, and topic. Each entry shows date, duration, topic tags, and notes preview.
 
![Session History wireframe](placeholder.png)
 
**Notes:** Showcases the topic-tagging custom feature (many-to-many relationship). Supports user stories 10, 11, 13, 14, 15. Topic filter could be a dropdown or clickable chips — still deciding which feels more tactile.
 
---
 
## 6. My Profile / Settings
 
Edit own name, timezone, and languages (add/remove/update proficiency). Includes account-level settings.
 
![My Profile wireframe](placeholder.png)
 
**Notes:** Supports user stories 1–3 in "edit" form. Lower priority for polish since it's less distinctive than the other pages, but necessary for completeness.
 
---
 
## Open decisions
 
- Dashboard: global streak (Version A) vs. per-partnership streak (Version B)
- Session History: topic filter as dropdown vs. chips
- Whether to build out reporting/blocking UI as part of wireframes or handle later as a settings-menu addition