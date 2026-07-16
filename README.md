# Cafecito
 
Designed and developed by: Tamara Berdichevsky
 
🔗 Link to deployed app: [add once deployed]
 
## About
 
### Description and Purpose
 
Cafecito is a full-stack web app that helps language learners find and manage practice partnerships. Users create a profile listing the language(s) they're learning and the language(s) they can offer in exchange, get matched with compatible partners, and log their practice sessions over time — tracking session frequency, duration, topics covered, and consistency streaks.
 
### Inspiration
 
As a bilingual educator who has spent nearly a decade teaching Art & Spanish and building bilingual immersion curricula, I've seen firsthand how much language acquisition depends on consistent, low-stakes conversational practice — something most existing language-exchange tools handle clumsily. Cafecito is designed to make the logistics of finding a partner and staying consistent as frictionless as possible, so learners can focus on the practice itself — like sitting down for a quick coffee chat with a friend.
 
# Tech Stack
 
**Frontend:** React, React Router, Vite, Tailwind CSS
 
**Backend:** Express, PostgreSQL (hosted on Render), ES Modules
 
## Features
 
### Partner matching
Users can browse and get matched with potential language partners based on complementary language pairs (e.g., a Spanish speaker learning French matched with a French speaker learning Spanish) and shared availability/timezone.
 
### Session logging
Users can log practice sessions with a partner, recording date, duration, and quick notes — with validation to prevent unrealistic entries (e.g., zero-minute sessions).
 
### Practice streak tracking
The app calculates and displays a user's consistency streak based on their logged sessions, encouraging regular practice.
 
### Language profile management
Users can add, edit, and remove the languages they speak and are learning, along with self-reported proficiency levels.
 
### Partnership status tracking
Users can view all active and past partnerships, with status (pending, active, ended) tracked per partnership.
 
### Quick session-logging modal
Users can log a session directly from the partnerships list via a modal — without navigating away — for a fast, low-friction way to record a "cafecito" right after it happens.
 
### Topic tagging
Users can tag a session with one or more topics or skills practiced (e.g., "past tense," "small talk," "travel vocabulary"). Topics can be selected from existing entries or created ad hoc, and sessions can be filtered by topic to review practice history.
 
### Reporting and blocking
Users can report another user with a reason, and/or block them — removing that user from future match results and preventing new partnership requests between the two.
 
## Installation Instructions
 
[instructions go here — will add once local setup is finalized]
 
