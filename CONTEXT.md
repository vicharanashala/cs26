# LLM Context Guide: Vicharanashala OAQ & Threads
**Conceptual Product Specification & Feature Reference Document for AI Coding Assistants**

This document serves as the absolute conceptual reference for the **Vicharanashala OAQ & Threads** platform. It describes the core product idea, user experience, features, rules, and gamified mechanics from a user and product perspective, omitting all underlying technical implementation details.

---

## 1. Project Concept & Mission

### What is Vicharanashala OAQ?
**Vicharanashala** is an onboarding and learning ecosystem for internships. **OAQ (Once Asked Questions)** is its core knowledge-sharing and query-tracking portal.

* **The Problem**: Interns frequently hit blocking technical or administrative issues, leading to redundant queries for mentors and slow onboarding.
* **The Solution**: A gamified, peer-to-peer query resolution system. Interns are incentivized to help resolve each other's blocking queries. The system ensures a question only needs to be asked and answered **once**—once resolved, it joins a searchable baseline knowledge base.

---

## 2. Roster of Roles & Access Ranks

Features are partitioned based on user responsibilities in the cohort:

| Role | Access Level |
|------|-------------|
| **Public / Cohort Member** | Can search baseline FAQs, read trending feeds, and browse resolved queries |
| **Intern** | Can raise dynamic queries, answer open FCFS queries, submit replies on resolved queries, raise forum threads, and vote on community replies |
| **Mentor** | Cohort moderator. Can flag low-quality replies, lock/unlock threaded discussions, promote answers, sign off resolutions |
| **Admin** | Cohort manager. Can manage user records, provision dynamic sections, manually override FCFS queries, and adjust SP wallet balances |
| **Superadmin** | Cohort director. Holds all manager controls and has exclusive authority to register/provision new Admins and trigger database seeder tools |

---

## 3. Product Features & How They Work (User Perspective)

Below is the complete list of all 15 features in the codebase, detailing their **Core Feature Idea** and **How it Works conceptually**.

---

### Feature 1 — 13 Locked Onboarding FAQ OAQ Library (formerly "Baseline OAQ")
* **Core**: An instantly accessible, read-only onboarding FAQ center representing 13 static categories to prevent common administrative queries from cluttering the open resolver board.
* **How it Works**: Displays 13 onboarding topics (ViBe, NOC, Teams, Onboarding, Reports, Finance, Schedule, Lab, Eval, SP, Yaksha, Tracker, General). Users click a category to slide open the accordion card and read the verified answer. Only one accordion open at a time. Sorted by ID, Most Upvoted, A→Z, Newest, or Oldest.

---

### Feature 2 — First-Come, First-Served (FCFS) Resolver Board
* **Core**: Gamify query resolution by creating a dynamic resolver board where interns compete to solve active technical roadblocks raised by their peers.
* **How it Works**: Lists all unresolved queries in a public resolver table grid. The first intern to submit a response "claims" the FCFS resolution via a 30-second TTL lock mechanism. If two users attempt to resolve simultaneously, the slower request gets a collision alert. Once submitted, the proposed answer enters a pending state awaiting community votes. Stale queries (no FCFS claimed within 24h) are highlighted in red/amber on the resolver board.
* **Activity Summary**: A summary card on the homepage shows each intern their personal activity pulse: queries raised, FCFS wins, pending review replies, and total upvotes received.

---

### Feature 3 — Automated Content Quality Auditor (Yaksha-mini)
* **Core**: An automated content gate checking submitted answers in real-time to protect the knowledge base from keyboard mashing, spam, copy-paste blocks, or low-quality one-liners.
* **How it Works**: Runs automatically during resolutions and reply submissions. Checks that the answer is at least 20 characters long, has at least 3 words, is not repetitive keyboard gibberish, and has a high percentage of meaningful words (word ratio >40%). A real-time preview badge shows the quality score before submission. Failed submissions are rejected with a -20 SP penalty.

---

### Feature 4 — Community Auto-Promotion System
* **Core**: Peer-driven validation of knowledge, allowing the collective community of interns to verify and approve answers.
* **How it Works**: When an intern submits an answer to an open FCFS query, it remains in a pending review queue. Other interns review and upvote/downvote it. Once a reply gains 3 net upvotes, it is auto-promoted to "Resolved" and locks as the master answer, rewarding the resolver with +50 SP.

---

### Feature 5 — Auto-Escalation Threshold Hook
* **Core**: Ensure high-severity roadblocks or queries of broad interest are automatically highlighted for mentor attention.
* **How it Works**: Tracks upvotes on open resolver questions. If an unresolved query reaches 5 upvotes within a 2-hour window, the system automatically elevates its priority status from Normal to HIGH and broadcasts a Socket.io alert to all connected mentors.

---

### Feature 6 — Collaborative Recommendation Rail (People Also Asked)
* **Core**: Suggest contextually related, highly relevant queries based on the collective search and browsing habits of the cohort.
* **How it Works**: The system learns which questions are frequently viewed together by tracking co-occurrence pairs whenever a user views an issue detail. The top related questions are displayed alongside the active query as "People Also Asked" recommendations.

---

### Feature 7 — RSS Trending Feed
* **Core**: Keep interns updated with the cohort's most relevant resolved issues and trending announcements.
* **How it Works**: Displays the top 15 resolved issues across all categories, sorted by upvote count (with pinned > featured > others), as a trending RSS feed on the homepage. Auto-refreshes every 5 minutes via setInterval.

---

### Feature 8 — Voice Search & Speech Playback
* **Core**: Enhance accessibility and interactive engagement by offering voice-controlled search and auditory answer playback.
* **How it Works**: Users can click a microphone icon to speak and search baseline FAQs. Additionally, each FAQ entry has a speaker button that uses the Web Speech API (SpeechSynthesis) to read the answer aloud in a natural en-IN accent voice.

---

### Feature 9 — Gamified Skill Points (SP) & Wallet Subsystem
* **Core**: Motivate cohort interns to actively participate and support peers by providing gamified metrics, progress visualizers, and milestones.
* **How it Works**:
  - **Overview tab**: Animates the user's active points total on load with a counter.
  - **Ledger tab**: A detailed credit/debit transaction history showing every SP change with reason and timestamp.
  - **Leaderboard tab**: A dynamic bar chart comparing all active intern balances relative to the highest earner, plus top 50 list.
  - **SP Awards Modal** (Admin/Superadmin): When closing a thread, opens a modal to award custom SP amounts to a selected participant from a dropdown of all thread contributors.

**SP Rules:**
| Action | SP Change |
|--------|-----------|
| Submit a valid FCFS reply | +5 SP |
| Win FCFS resolution (auto-promoted or accepted) | +50 SP |
| Raise a unique query | +10 SP |
| Auto-escalation trigger | +5 SP (to author) |
| Fail Yaksha audit | -20 SP |

---

### Feature 10 — Collaborative Nested Thread Discussions
* **Core**: Provide a nested discussion forum to handle complex, deep-dive technical conversations that extend beyond standard Q&A accordions.
* **How it Works**:
  - **Nested Tree Layout**: Replies render in indented conversation trees similar to forum message boards, with vertical connecting lines.
  - **OP Tags**: The thread creator is labeled with an "OP" badge in discussions.
  - **Upvote/Downvote**: Users can vote on any reply; net vote count is displayed.
  - **Reply inline**: Reply directly below any message in the nested tree.
  - **Thread Lock/Unlock** (Mentor+): Locks halt all incoming replies.
  - **Mark Resolved** (OP or Mentor+): Conceptual satisfaction marker; does not award SP.
  - **Best Reply Promotion** (Mentor+): Accepts any specific reply as best answer, auto-marks thread resolved, highlights reply as "Accepted."
  - **Dynamic SP Award** (Admin/Superadmin): When closing a thread, awards a custom SP amount to a selected thread participant.

---

### Feature 11 — Dynamic Section Filters
* **Core**: Allow users to filter large sets of questions based on specific categories or dynamic topics.
* **How it Works**: A multi-select section filter bar on the homepage feeds category predicates into API calls. Filters apply to baseline, trending, and tracker views simultaneously.

---

### Feature 12 — Admin Moderation & Management Panel
* **Core**: Provide administrative overseers with a consolidated dashboard to organize categories, manage cohort rosters, and review flagged items.
* **How it Works**:
  - **Mod Queues**: Distinct queues for flagged replies, downvoted issues, and unanswered queries.
  - **Roster Edits**: Modify cohort profiles and SP balances. Role assignments are protected—a user cannot change their own role, and only Superadmins can assign Admin/Superadmin roles.
  - **Dynamic Sections**: Full CRUD over category lists.
  - **Seeder Gates**: Master seeder triggers to clear and re-initialize baseline collections.
  - **Issue Detail View**: Dedicated page for each issue with full history, replies, voting, and moderation actions.

---

### Feature 13 — Real-Time Sync Broadcaster
* **Core**: Ensure all online participant sessions are instantly synchronized when events occur in the cohort, without manual refreshes.
* **How it Works**: Socket.io broadcasts on every meaningful action: issue created, resolved, upvoted, replied, escalated, thread locked/unlocked, duplicate marked. Toast notifications inform users of real-time events.

---

### Feature 14 — Duplicate Query Prevention
* **Core**: Detect potentially redundant queries before they are raised, reducing resolver clutter and guiding interns to existing answers.
* **How it Works**: As the user types a new query in the Raise Query modal, a dual-algorithm similarity scorer runs in the background—word-level matching (50% weight) plus character overlap scoring (50% weight)—against all non-Duplicate issues including baseline FAQs. Results above a 35% threshold appear in a color-coded warning panel (red ≥70%, amber ≥50%, green <50%) showing match percentage, section tag, FAQ badge, and status. The user sees this before submitting and can cancel to check the existing answer first. Uses 400ms debounce.

---

### Feature 15 — Yaksha Mini AI Chat Widget
* **Core**: Provide an always-accessible AI assistant backed by the FAQ knowledge base, capable of streaming contextual answers in real-time.
* **How it Works**: A floating 🤖 button in the bottom-right corner opens a chat panel. Messages are sent to `POST /api/rag/chat` which builds context by retrieving relevant resolved baseline Q&As via MongoDB `$regex` text search on `queryText` and `answer` fields. When `OPENAI_API_KEY` is set, responses are streamed from GPT-3.5-turbo via Server-Sent Events (SSE); otherwise a fallback returns keyword-matched KB answers as plain text. The widget is visible only to authenticated users and resets chat history on each session. Enter sends, Shift+Enter adds newline. Blinking cursor shown during streaming.

---

## 4. SP Gamification Rules Summary

| Action | SP Awarded To | Amount |
|--------|--------------|--------|
| Submit valid FCFS reply | Responder | +5 |
| Win FCFS resolution | Resolver | +50 |
| Raise unique query | Author | +10 |
| Trigger auto-escalation (5 upvotes / 2hrs) | Author | +5 |
| Pass Yaksha audit on resolution | Resolver | +50 (part of win) |
| Fail Yaksha audit on resolution | Resolver | -20 |
| Thread close SP award | Selected participant | Custom (Admin) |

---

## 5. Data Models (Conceptual)

### OAQIssue
The core tracker entity. Key fields: `issueId` (sequential integer), `queryText`, `answer`, `categoryTag` ("01"–"13"), `status` (Open/Resolved/Duplicate), `priority` (NORMAL/HIGH), `isBaseline` (locks entry from tracker), `isPinned`, `isFeatured`, `upvoteCount`, `communityReplies[]`, `raisedBy`, `resolvedBy`, `duplicateOf`.

### User
Cohort member. Fields: `name`, `email`, `password` (hashed), `role` (intern/mentor/admin/superadmin), `sp` (running total), `langPref`, `joinDate`.

### Section
Category metadata. Fields: `sectionId` ("01"–"13"), `label`, `scope`, `description`, `color`, `locked`.

### CoOccurrence
Collaborative filtering pairs. Tracks pairs of `issueIdA` + `issueIdB` with `viewCount` for recommendation rail.

### SPLedger
Immutable transaction ledger. Fields: `userId`, `delta` (+/-), `reason`, `refId` (issue/thread ID), `createdAt`.

### Thread
Forum discussion thread. Fields: `title`, `body`, `tags[]`, `postedBy`, `isLocked`, `isResolved`, `resolvedAnswerId`, `communityReplies[]`, `upvotes`, `downvotes`.

---

## 6. API Design Overview

- **Auth**: JWT-based. Token sent via `Authorization: Bearer <token>` header. 7-day expiry. Client distinguishes session expiry vs login failure via different toast messages.
- **Google OAuth**: Google sign-in via passport-google-oauth20 strategy. Callback at `/api/auth/google/callback`.
- **Forgot Password**: `POST /api/auth/forgot-password` endpoint sends reset link. `POST /api/auth/reset-password` processes reset token.
- **Registration**: Password confirm field + eye toggle visibility + form validation enforced on both client and server.
- **FCFS Lock**: 30-second TTL lock using `lockedBy` + `lockExpiry` on OAQIssue. Concurrent resolve attempts return `409 COLLISION`. Stale queries (no FCFS claimed within 24h) are highlighted and auto-escalated via `server/services/staleWatcher.js`.
- **Yaksha Audit**: Runs synchronously on every resolve/reply submission before acceptance. Rejects with -20 SP penalty on failure.
- **Auto-Promotion**: After any reply submission or vote, `checkAutoPromote()` promotes any reply with `upvotes >= 3`.
- **RAG Streaming**: Backend fetches OpenAI Chat Completions API with `stream: true`, pipes SSE chunks to client via `res.write`.
- **Duplicate Check**: In-memory scan of all non-Duplicate issues with dual-algorithm scoring, no external AI needed.