# Features
 
## Baseline features
 
### 1. Partner matching
Users can browse a list of other users, filtered by complementary language pairs (their `learning_language` matches another user's native/speaking language and vice versa) and optionally by timezone.
- **Type:** Baseline (view + filter)
- **Routes:** `GET /users?learning=&native=&timezone=`
- **Tables involved:** `users`, `languages`

### 2. Partnership requests
Users can send a request to another user to start a language partnership. The receiving user can accept or decline.
- **Type:** Baseline (create, update)
- **Routes:** `POST /partnerships`, `PATCH /partnerships/:id`
- **Tables involved:** `partnerships`

### 3. Session logging
Users can create a log entry for a completed practice session tied to a specific partnership, including date, duration, and notes. Sessions can be edited or deleted.
- **Type:** Baseline (create, view, update, delete)
- **Routes:** `GET /partnerships/:id/sessions`, `POST /sessions`, `PATCH /sessions/:id`, `DELETE /sessions/:id`
- **Tables involved:** `sessions`, `partnerships`

### 4. Language profile management
Users can add, edit, and remove languages from their profile, each with a self-reported proficiency level.
- **Type:** Baseline (create, view, update, delete)
- **Routes:** `GET /users/:id/languages`, `POST /languages`, `PATCH /languages/:id`, `DELETE /languages/:id`
- **Tables involved:** `languages`, `users`

## Custom features
 
### 5. Practice streak tracking
The app calculates a user's current consecutive-practice streak based on the dates of their logged sessions, and displays it on their profile/dashboard.
- **Type:** Custom — data automatically generated in response to a user action (streak recalculates whenever a session is logged)
- **Routes:** `GET /users/:id/streak` (or computed server-side and included in the user payload)
- **Tables involved:** `sessions`

### 6. Session duration validation
When a user logs a session, the backend validates that the duration is a realistic, non-zero value before the database is updated, returning a graceful error if not.
- **Type:** Custom — data validation on POST/PATCH + graceful error handling
- **Routes:** `POST /sessions`, `PATCH /sessions/:id`
- **Tables involved:** `sessions`

### 7. Quick session-logging modal
From the partnerships list, users can open a modal to log a session without navigating to a new page. On submit, the session list and streak update in place.
- **Type:** Custom — same-page interaction (modal), no navigation required
- **Routes:** `POST /sessions` (called from modal, same page re-renders on success)
- **Tables involved:** `sessions`

### 8. Topic tagging
Users can tag a session with one or more topics or skills practiced (e.g., "past tense," "small talk," "travel vocabulary"). Topics can be selected from existing entries or created ad hoc, and sessions can be filtered by topic to review practice history.
- **Type:** Custom — many-to-many relationship + filtering
- **Routes:** `GET /sessions?topic=`, `POST /session-topics`, `DELETE /session-topics/:id`
- **Tables involved:** `sessions`, `topics`, `session_topics`

### 9. Reporting and blocking
Users can report another user (with a reason) and/or block them, which removes that user from future match results and prevents new partnership requests between the two. Supports the app's trust and safety by giving users control over who they interact with.
- **Type:** Custom — create + graceful handling of blocked-user interactions
- **Routes:** `POST /reports`, `POST /blocks`, `DELETE /blocks/:id`
- **Tables involved:** `reports`, `blocks`, `users`

## Design principles (not standalone features)
 
- **Profile transparency over anonymity:** partner profiles show proficiency level, join date, and number of completed sessions, so users have real signal about who they're matching with rather than interacting with bare, unverified accounts.
