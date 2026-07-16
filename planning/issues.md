# Cafecito — Issue Roadmap
 
Ordered by dependency, not necessarily by priority. Foundational/infrastructure issues come first since later feature issues depend on them.
 
---
 
## Milestone: Setup & Infrastructure
 
### 1. Set up Express backend and PostgreSQL connection
- Initialize Node/Express project with ES modules
- Set up `pg` connection to local PostgreSQL, add `.env` for credentials
- Add basic health-check route (`GET /`) to confirm server + DB connection work
- Set up folder structure: `routes/`, `controllers/`, `db/`
### 2. Set up React frontend with Vite and Tailwind
- Scaffold React app with Vite
- Install and configure Tailwind CSS
- Set up React Router
- Set up basic folder structure: `pages/`, `components/`, `api/`
### 3. Build database schema and migrations
- Create tables: `users`, `languages`, `partnerships`, `sessions`, `topics`, `session_topics`, `reports`, `blocks`
- Add foreign key constraints and the unique field on `partnerships.match_date`
- Write a seed script with sample data for local development
- Add a reset-database script/endpoint (baseline requirement: app can reset DB to default state)
---
 
## Milestone: Baseline Features
 
### 4. User signup and profile creation
- `POST /users` — create a new user with name, email, timezone
- `GET /users/:id` — fetch a single user's profile
- `PATCH /users/:id` — update profile fields
- Frontend: Sign Up page/form
### 5. Language profile management
- `GET /users/:id/languages`, `POST /languages`, `PATCH /languages/:id`, `DELETE /languages/:id`
- Frontend: add/edit/remove languages on My Profile page, with proficiency level input
### 6. Partner matching / browse
- `GET /users?learning=&native=&timezone=` — filtered list of potential partners
- Frontend: Browse Partners page with filter UI and partner cards
### 7. Partnership requests
- `POST /partnerships` — send a request
- `PATCH /partnerships/:id` — accept/decline/end a partnership
- `GET /users/:id/partnerships` — list a user's partnerships
- Frontend: Partner Profile page (send request), Dashboard page (view/manage partnerships)
### 8. Session logging (CRUD)
- `GET /partnerships/:id/sessions`, `POST /sessions`, `PATCH /sessions/:id`, `DELETE /sessions/:id`
- Frontend: Session History page, basic log form
---
 
## Milestone: Custom Features
 
### 9. Session duration validation
- Backend validation: reject sessions with duration ≤ 0 or unrealistically high, return graceful error message
- Frontend: display validation errors in the log form
### 10. Practice streak tracking
- Backend logic to calculate current streak from a user's session dates
- `GET /users/:id/streak` or include streak in user payload
- Frontend: streak display on Dashboard
### 11. Quick session-logging modal
- Frontend: modal (desktop) / bottom sheet (mobile) triggered from Dashboard, submits without full page navigation
- Reuses `POST /sessions` from issue 8
### 12. Topic tagging
- `GET /topics`, `POST /topics` (create ad hoc)
- `POST /session-topics`, `DELETE /session-topics/:id`
- `GET /sessions?topic=` — filter sessions by topic
- Frontend: topic input/selector in log form, topic filter on Session History page
### 13. Reporting and blocking
- `POST /reports` — file a report with reason
- `POST /blocks`, `DELETE /blocks/:id` — block/unblock a user
- Backend: exclude blocked users from match results (issue 6) and prevent partnership requests between blocked pairs
- Frontend: report/block actions on Partner Profile page
---
 
## Milestone: Polish
 
### 14. Profile transparency details
- Add `joined_at` display and completed-session count to Partner Profile page
### 15. Landing page
- Build out Landing/Login page with feature highlights row
### 16. Mobile responsiveness pass
- Verify all pages against mobile-first layouts already wireframed (bottom tab bar, stacked cards, bottom sheet modal)
- Adjust breakpoints as needed for tablet/desktop