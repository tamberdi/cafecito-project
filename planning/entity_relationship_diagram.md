# Entity Relationship Diagram
 
![Cafecito ERD](placeholder.png)
 
## Tables
 
### users
| Column | Type | Notes |
|---|---|---|
| id | int, PK | |
| name | string | |
| email | string | |
| timezone | string | |
| joined_at | date | supports profile transparency (member since) |
 
### languages
| Column | Type | Notes |
|---|---|---|
| id | int, PK | |
| user_id | int, FK → users.id | |
| language | string | |
| level | string | proficiency level |
| is_native | boolean | |
 
### partnerships
| Column | Type | Notes |
|---|---|---|
| id | int, PK | |
| user_a_id | int, FK → users.id | requester |
| user_b_id | int, FK → users.id | recipient |
| match_date | date, unique | unique field on the join table |
| status | string | pending / active / ended |
 
### sessions
| Column | Type | Notes |
|---|---|---|
| id | int, PK | |
| partnership_id | int, FK → partnerships.id | |
| session_date | date | |
| duration_minutes | int | validated: must be > 0 |
| notes | string | |
 
### topics
| Column | Type | Notes |
|---|---|---|
| id | int, PK | |
| name | string | |
| category | string | e.g. grammar, vocabulary, conversation |
 
### session_topics
| Column | Type | Notes |
|---|---|---|
| id | int, PK | |
| session_id | int, FK → sessions.id | |
| topic_id | int, FK → topics.id | |
 
### reports
| Column | Type | Notes |
|---|---|---|
| id | int, PK | |
| reporter_id | int, FK → users.id | |
| reported_id | int, FK → users.id | |
| reason | string | |
| reported_at | date | |
 
### blocks
| Column | Type | Notes |
|---|---|---|
| id | int, PK | |
| blocker_id | int, FK → users.id | |
| blocked_id | int, FK → users.id | |
| blocked_at | date, unique | |
 
## Relationships
 
- **users → languages**: one-to-many (a user can speak/learn multiple languages)
- **users ↔ users via partnerships**: many-to-many with a join table (`partnerships`), self-referencing since both sides of a partnership are users; `match_date` is the unique field on the join table
- **partnerships → sessions**: one-to-many (a partnership can have many logged sessions)
- **sessions ↔ topics via session_topics**: many-to-many with a join table, between two distinct entities
- **users → reports**: one-to-many (a user can file multiple reports)
- **users → blocks**: one-to-many (a user can block multiple other users)