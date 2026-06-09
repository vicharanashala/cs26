# Implemented Features — Vicharanashala OAQ System

> Documenting all features implemented from `SUGGESTION.md`. Last updated after Session 5.

---

## ✅ Fully Implemented (23 items)

### #1 — React Router for URL Navigation
**File:** `client/src/App.jsx` (lines 1-2, 102-114, 122-132, 141)
- `BrowserRouter`, `Routes`, `Route` from `react-router-dom`
- Routes: `/` (Home), `/threads`, `/tracker`, `/sp`, `/admin`
- `PersistRoute` restores last visited route from localStorage
- Topbar uses `useLocation()` for active state highlighting

### #2 — Replace All `prompt()` / `confirm()` with Proper Modals
**Files:** `client/src/components/SharedModals.jsx`, `client/src/pages/AdminPage.jsx`, `client/src/pages/ThreadsPage.jsx`
- `ConfirmModal`, `InputModal`, `SPAdjustModal`, `ThreadCloseModal` reusable components
- `AdminPage.jsx`: `handleDelete` and `handlePromoteConfirm` handlers added; Delete and Promote Best buttons now open `ConfirmModal` instead of native `confirm()`
- `ThreadsPage.jsx`: thread close uses `ThreadCloseModal`

### #3 — Fix RecommendationRail Click Handlers
**File:** `client/src/components/AccordionDrawer.jsx` (line 101)
- `onSelect` prop wired to `handleViewRecRelated`
- `RecommendationRail.jsx` line 29 fires `onSelect(item._id)`
- TrendingFeed/HomePage properly handle the selection

### #4 — Make Search Results Clickable
**File:** `client/src/pages/HomePage.jsx` (lines 211-218)
- Clicking a search result calls `api.get('/oaq/${entry._id}')`, opens `AccordionDrawer`

### #5 — Handle Session Expiry Gracefully
**Files:** `client/src/services/api.js` (lines 16-20), `client/src/App.jsx` (lines 36-52)
- 401 response dispatches `oaq:session-expired` custom event
- `SessionExpiryHandler` in App.jsx clears localStorage, shows toast, navigates to `/`

### #6 — Toast Types (success/error/warning/info/mention)
**File:** `client/src/context/ToastContext.jsx` (lines 8-13)
- `addToast()` accepts `type` option; `global.css` applies colored borders per type
- Added `mention` type with purple left border (`#8B5CF6`)

### #7 — "You Answered" Badge in OpenQueryCard
**File:** `client/src/components/OpenQueryCard.jsx` (lines 16-18, 89-91)
- `hasAnswered` checks `communityReplies.some(r => r.repliedBy._id === currentUser._id)`
- Teal "✓ YOU ANSWERED" pill rendered in issue header

### #8 — Remove Dead SP Bank Tabs
**File:** `client/src/components/SPDashboard.jsx` (lines 404-408)
- Reduced to exactly 3 tabs: `Overview`, `Ledger`, `Leaderboard`
- Dead "Chats", "Polls", "Top 50" tabs removed

### #9 — TrendingFeed Respects Section Filter
**File:** `client/src/components/TrendingFeed.jsx` (lines 58-60)
- Filters feed based on `filteredSections` prop
- `HomePage.jsx` passes `filteredSections={sections}`

### #10 — Keyboard Shortcuts (Esc + /)
**File:** `client/src/App.jsx` (lines 54-71)
- `KeyboardShortcuts` component handles `/` (focus search) and `Escape` (close modals)

### #11 — Dark Mode Properly Implemented
**File:** `client/src/context/ThemeContext.jsx` (lines 3-53, 61-64)
- Full `light` and `dark` theme token objects with CSS variables
- Sets `data-theme` on `document.documentElement`, persisted to localStorage

### #12 — User Profile Modal
**File:** `client/src/components/UserProfileModal.jsx`
- Fetches from `users.getProfile(userId)`, shows name/role/SP/rank/badges/SP breakdown
- Triggered by `oaq:show-user-profile` custom event
- Dispatched from OpenQueryCard (issue/reply author clicks), SPDashboard (leaderboard)

### #13 — Duplicate Detection When Raising Queries
**File:** `client/src/components/RaiseQueryModal.jsx` (lines 19-31)
- `useEffect` with 500ms debounce on `queryText`
- Searches `/oaq/search?q=...` and shows up to 3 similar queries with amber warning box

### #14 — TrendingFeed Timestamps
**File:** `client/src/components/TrendingFeed.jsx` (lines 5-12, 85-89)
- `timeAgo()` function (just now, Xm, Xh, Xd) rendered per feed item

### #15 — "Mark as Duplicate" for Issue Authors
**File:** `client/src/components/OpenQueryCard.jsx` (lines 34, 36-50, 52-65, 131-158)
- `isAuthor` check (only issue creator sees the button)
- Debounced 400ms search effect against `/oaq/search`
- "Mark as Duplicate" button reveals inline search → clickable results
- `handleMarkDuplicate` calls `oaq.markDuplicate(issue._id, targetId)`

### #16 — Responsive CSS (Mobile Support)
**File:** `client/src/global.css` (lines 541-576)
- `@media (max-width: 768px)`: topbar wraps, main-content padding reduced, modals 95vw, tracker table scrollable, tabs horizontal scroll
- `@media (max-width: 480px)`: further padding reductions, toast repositioning

### #17 — "Your Rank" Highlight in Leaderboard
**File:** `client/src/components/SPDashboard.jsx` (lines 556-561, 569-573)
- "Your Rank: #X of Y totalInterns" banner shown when `wallet.rank` exists
- `entry.isYou` rows highlighted with left border

### #18 — Socket Reconnection UI Feedback
**Files:** `client/src/context/SocketContext.jsx` (line 24), `client/src/components/Topbar.jsx` (lines 28-32)
- `SocketContext` sets `connected=false` on socket disconnect
- Topbar renders amber "⚡ Reconnecting... (live updates paused)" banner when `!connected`
- Banner dismisses automatically when socket reconnects

### #22 — Badge Detail View Modal
**File:** `client/src/components/SPDashboard.jsx` (lines 78-152, ~355, ~688)
- `ALL_BADGES` array defines all 10 badge types with descriptions, icons, and SP thresholds
- `BadgeModal` component shows earned vs unearned badges in a 2-column grid
- Unearned badges show 🔒 icon and a progress bar toward the threshold
- Earned badges show ✓ EARNED label with teal styling
- Clicking the BadgeCard section on the Overview tab opens the modal
- Modal passes `earnedBadges`, `totalSP`, and `walletRank` for accurate progress display

### #23 — View Count Display on Threads
**File:** `client/src/pages/ThreadsPage.jsx` (line 739)
- `viewCount` displayed in thread card metadata as `👁 {thread.viewCount || 0}`
- Backend increments `viewCount` on thread open (`Thread.findByIdAndUpdate` with `$inc` in routes/threads.js)

### #19 — "Copy Answer" Button in AccordionDrawer
**File:** `client/src/components/AccordionDrawer.jsx` (lines 53-60, 84-88)
- `handleCopy` uses `navigator.clipboard.writeText(entry.answer)`
- "Answer copied!" success toast on completion

### #20 — Recent Search History
**File:** `client/src/pages/HomePage.jsx` (lines 49-52, 121-124, 167-180)
- `recentSearches` state loaded/saved from localStorage (`oaq_recent_searches`)
- Dropdown shows clickable recent searches

### #21 — Empty State Illustrations
- Emoji illustrations added to all 6 empty states across the app:
  - HomePage search empty: 🔍 (line 198)
  - HomePage open queries empty: 💬 (line 279)
  - TrendingFeed empty: 📊 (TrendingFeed.jsx line 63)
  - BaselineOAQ empty: 📂 (BaselineOAQ.jsx line 69)
  - TrackerPage empty: 📋 (TrackerPage.jsx line 123)
  - ThreadsPage empty: 💬 (ThreadsPage.jsx line 718)

### #28 — Confetti/Celestone Celebrations
**File:** `client/src/components/SPDashboard.jsx` (line 4, lines 331-341)
- `canvas-confetti` imported and used in `useEffect` watching `spAnim`/`wallet`
- Triggers confetti at SP milestones 100, 250, 500, 1000

### #24 — Stale Issue Highlighting
**File:** `client/src/pages/TrackerPage.jsx` (lines 23-26, 153-154)
- `isStale(issue)` checks if >48h old AND no community replies
- Stale rows get `background: '#FFF7ED', borderLeft: '3px solid #F97316'` orange styling

### #25 — Admin Time Range Filter
**Files:** `client/src/pages/AdminPage.jsx` (lines ~47, ~60, ~125), `client/src/services/api.js` (line 92), `server/routes/admin.js` (lines 13-36)
- `statsRange` state (`'all'`, `'7d'`, `'30d'`) added to AdminPage
- `admin.getStats(range)` accepts optional `range` param and passes `?range=XX` to server
- Server applies `createdAt: { $gte: since }` filter to all count queries when range is set
- Range selector dropdown rendered above overview stat cards with All Time / Last 7 Days / Last 30 Days

### #26 — New Issues Badge in Tab Navigation
**File:** `client/src/components/Topbar.jsx` (lines 12, 14-33, ~55)
- `newIssueCount` state tracks unread new issues, persisted to `localStorage`
- Socket `issue:created` event increments count when not on tracker tab
- Tracker tab button shows red badge with count (capped at 99+); disappears when navigating to Tracker tab
- Count cleared from localStorage on tracker visit

### #27 — Mentions (@) Notification System
**Files:** `client/src/pages/ThreadsPage.jsx` (lines 207-220), `server/routes/threads.js` (lines 131-138), `client/src/global.css` (line 474)
- Server emits `thread:replied` with `mentions[]` and `threadTitle` in payload
- Client socket handler checks if `data.mentions.includes(currentUser._id)` and shows mention toast
- Toast type `'mention'` added with purple left border styling

### QW-1 — Make search results clickable
See #4 above.

### QW-2 — Wire RecommendationRail click
See #3 above.

### QW-3 — "You answered" badge in OpenQueryCard
See #7 above.

### QW-4 — Remove dead SP Bank tabs
See #8 above.

### QW-5 — Add timestamps to TrendingFeed
See #14 above.

### QW-6 — Fix empty search result handling
**File:** `client/src/pages/HomePage.jsx` (lines 197-202)
- Empty search state shows message + "Raise Query" CTA button

### QW-7 — Add Esc key to close modals
See #10 above.

### QW-8 — "Your rank" banner in leaderboard
See #17 above.

### QW-10 — Copy-to-clipboard on answers
See #19 above.

### QW-9 — Fix stale issue highlighting
See #24 above — implemented.

---

## Summary

| Category | Count |
|----------|------:|
| ✅ Fully Implemented | 30 |
| ⚠️ Partially Implemented | 0 |
| ❌ Not Implemented | 0 |
| **Total** | **30** |

### Recently Completed (Session 7)
- **#25** Admin time range filter — `statsRange` state selector (All Time/7d/30d) in AdminPage overview tab; `admin.getStats(range)` passes `?range=` param to server; backend filters counts by `createdAt >= since`
- **#26** New issues badge in tab navigation — red badge on Tracker tab button showing unread count; socket `issue:created` increments; persists in localStorage; cleared on tracker visit
- **#27** Mentions (@) notification — server emits `mentions[]` with `thread:replied` event; client checks `mentions.includes(user._id)` and shows purple-bordered mention toast