# Chops App — Project Knowledge Extraction

> Extracted from `old-react-chops-project/client/src/` and `chops-app 2/client/src/shared/model/`. This document is designed to be fed to Claude in a new repo to inform architecture decisions and preserve domain knowledge. It contains exact models, component structure, business logic, and patterns — not code to copy directly. Models reflect v2 improvements (dropped `I` prefix, Exercise→LibraryItem with time sig change support, MusicXML import, ownership fields).

---

## APP OVERVIEW

A music practice app called "Chops" built with React 18 + TypeScript + Material-UI. It lets users:

1. **Create library items** — define time signatures (with mid-piece changes) and measure counts, optionally imported from MusicXML
2. **Build click tracks** — compose metronome sequences with variable tempo, duration types, count-ins, and counts-between
3. **Assemble sessions** — order click tracks into practice sessions
4. **Play sessions** — play back sessions with a Web Audio API metronome

**Tech stack:** React 18.1, React Router 6.3, MUI 5.6, TypeScript 4.6, SCSS Modules, native `fetch()` for API calls. No state management library — all local `useState`/`useEffect` with prop drilling.

**Routes:**

- `/dashboard` → Landing (empty placeholder)
- `/library` → LibraryItemList
- `/click-track-builder/*` → ClickTrackBuilder
- `/session/*` → SessionBuilder (sub-routes: `/` for list, `/:id` for detail)
- `/player/*` → Player

---

## ALL MODELS (EXACT)

### ClickTrack

```typescript
export interface ClickTrack {
  _id?: string;
  name: string;
  totalTimeDisplay?: string;
  totalTimeMilliseconds?: number;
  totalCounts?: number;
  category: string;
  libraryItemId: string;
  libraryItemName: string;
  clickTrackItems: ClickTrackItem[];
}
```

### ClickTrackItem

```typescript
export interface ClickTrackItem {
  countIn: number;
  countInType: string;
  duration: number;
  durationType: string; // "reps" | "counts" | "measures" | "minutes" | "seconds"
  timeSignatureTopNumber: number;
  timeSignatureBottomNumber: number;
  tempoType: string; // e.g. "quarter"
  tempo: number;
  countsBetween: number;
  countsBetweenType: string;
  totalCounts: number;
  totalTimeDisplay: string;
  totalTimeMilliseconds: number;
}
```

### LibraryItem & LibraryItemMeasureItem

Replaces the old flat "Exercise" model. Now supports multiple time signature changes within a piece, MusicXML import, and ownership.

```typescript
export interface LibraryItem {
  _id?: string;
  title: string;
  timeSigChangeMeasureItems: LibraryItemMeasureItem[];
  originalTimeSigChangeMeasureItems?: LibraryItemMeasureItem[];
  totalMeasures: number;
  fromXml: boolean;
  dateCreated?: Date;
  dateModified?: Date;
  userId?: string;
  orgIds?: string[];
}

export interface LibraryItemMeasureItem {
  startingMeasureNumber: number;
  measureCount: number;
  beats: number;      // replaces timeSignatureTopNumber
  beatType: number;   // replaces timeSignatureBottomNumber
}
```

### Session

```typescript
export interface Session {
  _id?: string;
  name: string;
  clickTracks: ClickTrack[];
  totalTimeDisplay: string;
  totalTimeMilliseconds: number;
  totalCounts: number;
}
```

### MetronomeMapItem & BeatTypeOption

```typescript
export interface MetronomeMapItem {
  pitch: string; // "high" | "medium" | "low" | "none"
  tempo: number;
  beatType: string;
  time?: number;
}

export enum BeatTypeOption {
  CountIn = "countIn",
  Main = "main",
  CountsBetween = "countsBetween",
}
```

### Route

```typescript
export interface Route {
  label: string;
  url: string;
}
```

### RequestMethods

```typescript
export enum RequestMethods {
  Get = "GET",
  Post = "POST",
  Put = "PUT",
  Delete = "DELETE",
}
```

### Default Values (empty-click-track.ts)

```typescript
export const EMPTY_CLICK_TRACK_ITEM: ClickTrackItem = {
  countIn: 8,
  countInType: "counts",
  duration: 8,
  durationType: "measures",
  timeSignatureTopNumber: 4,
  timeSignatureBottomNumber: 4,
  tempo: 120,
  tempoType: "quarter",
  countsBetween: 4,
  countsBetweenType: "counts",
  totalCounts: 0,
  totalTimeDisplay: "",
  totalTimeMilliseconds: 0,
};

export const EMPTY_CLICK_TRACK: ClickTrack = {
  name: "",
  category: "",
  clickTrackItems: [/* one EMPTY_CLICK_TRACK_ITEM with calculated totals */],
  totalTimeDisplay: "",
  totalTimeMilliseconds: 0,
  totalCounts: 0,
  libraryItemId: "",
  libraryItemName: "",
};
```

---

## COMPONENT STRUCTURE BREAKDOWN

### 1. ClickTrackBuilder

**Purpose:** CRUD interface for creating metronome click tracks — the core building block of the app.

**Component tree:**

```
ClickTrackBuilder (root — fetches library items + click tracks, manages URL search filtering)
└── ClickTrackList (grid of cards, manages dialog state for create/edit/copy/delete)
    ├── DesktopToolbar (shared — "new" button + search input)
    ├── ClickTrack[] (card per click track — shows name, time, library item, category)
    │   ├── ItemCard (shared card wrapper with menu)
    │   └── ClickTrackItem[] (detail view in menu — read-only display of each segment)
    ├── Empty (shared — empty state)
    └── ClickTrackDialog (MUI Dialog — handles API save)
        └── ClickTrackForm (full form state — name, category, library item toggle, dynamic items)
            ├── TimeSignatureSelect (shared — top/bottom number dropdowns)
            └── ClickTrackFormItem[] (one per segment — count-in, duration, tempo, counts-between)
```

**Props flow:**

```
ClickTrackBuilder
  ├── libraryItems: LibraryItem[]
  ├── clickTracks: ClickTrack[]
  ├── libraryItemsIdMap: Record<string, LibraryItem>
  ├── loading: boolean
  └── searchInput: string (from URL)
     ↓
ClickTrackList
  ├── ClickTrack (per item)
  │   ├── clickTrack: ClickTrack
  │   ├── libraryItemsIdMap: Record<string, LibraryItem>
  │   └── handleEdit, handleDelete, handleCopy: () => void
  │
  └── ClickTrackDialog
      ├── isOpen, edit: boolean
      ├── clickTrack: ClickTrack
      ├── copiedItems: ClickTrackItem[]
      ├── libraryItems: LibraryItem[]
      └── libraryItemsIdMap: Record<string, LibraryItem>
         ↓
      ClickTrackForm
         ├── ClickTrackFormItem (per item)
         │   ├── clickTrackItem: ClickTrackItem
         │   ├── index: number
         │   ├── forLibraryItem: string ("yes"/"no")
         │   └── clickTrackCount: number
         └── TimeSignatureSelect
```

**Key behaviors:**

- A click track has N "items" (segments), each with its own count-in, duration type, tempo, and optional counts-between
- Duration types: reps (repeats of a library item), counts, measures, minutes, seconds
- Time signature selector only appears when durationType is "measures"
- Counts-between only appears when durationType is "reps" and duration > 1
- Click tracks can optionally be associated with a library item
- Copy feature duplicates a click track's items into the clipboard for pasting into a new track
- Totals (time, counts) are recalculated on every form change via `addClickTrackTotals()`

---

### 2. Library Items (was "Exercises" in v1)

**Purpose:** CRUD for library items — pieces of music with time signatures, measure counts, and optional MusicXML import. Library items are referenced by click tracks for rep-based durations.

**Component tree:**

```
LibraryItemList (root — fetches library items, manages dialog state)
├── NewLibraryItemButton ("Create New" CTA)
├── LibraryItem[] (card per item — shows title, time sig(s), measure count, edit/delete)
└── NewLibraryItemDialog (MUI Dialog — create or edit mode)
    └── NewLibraryItemForm (title, time sig change measure items, total measures)
```

**Props flow:**

```
LibraryItemList
  ├── LibraryItemCard (per item)
  │   ├── libraryItem: LibraryItem
  │   ├── editItem: () => void
  │   └── deleteItem: () => void
  │
  └── NewLibraryItemDialog
      ├── isOpen, edit: boolean
      ├── form: LibraryItem
      ├── id: string
      ├── handleClose: () => void
      └── getAllLibraryItems: () => void
         ↓
      NewLibraryItemForm
         ├── form: LibraryItem
         └── valueChange: (form: LibraryItem) => void
```

**Key behaviors:**

- Library items define the musical structure that click tracks play against
- They support multiple time signature changes mid-piece via `timeSigChangeMeasureItems[]`
- Each `LibraryItemMeasureItem` specifies a starting measure, measure count, beats (top), and beat type (bottom)
- Can be imported from MusicXML files (`fromXml: true`), preserving the original structure in `originalTimeSigChangeMeasureItems`
- They exist primarily so click tracks can reference them for "reps" duration type
- Click tracks link to library items via `libraryItemId` (single source of truth — no reverse `clickTracks` array on the library item)

---

### 3. SessionBuilder

**Purpose:** Compose click tracks into ordered practice sessions. Uses a split-view layout: form on left, searchable click track sidebar on right.

**Component tree:**

```
SessionBuilder (root — fetches library items, click tracks, sessions; manages routing)
├── Route "/" → SessionBuilderList (grid of session cards)
│   └── SessionBuilderListItem[] (card per session — name, time, click track names)
│       └── ItemCard (shared)
│
└── Route "/:id" → PageWrapperSidebar (two-column layout)
    ├── main: SessionBuilderDetail (manages form state, add/remove click tracks)
    │   ├── PageHeader (back button + save button)
    │   └── SessionForm (name input + ordered list of click tracks)
    │       ├── SessionItem[] (click track in session with remove button, "+" connectors)
    │       └── Empty (shared)
    │
    └── sidebar: SessionBuilderSidebar (search/filter available click tracks)
        ├── ToggleButtonGroup (search by: name / libraryItemName / category)
        ├── TextField (search input)
        └── SessionBuilderSidebarItem[] (click track with "add" button)
```

**Props flow:**

```
SessionBuilder
  ├── SessionBuilderList
  │   ├── sessions: Session[]
  │   ├── searchInput: string
  │   └── getAllSessions: () => void
  │
  └── SessionBuilderDetail
      ├── sessions: Session[]
      ├── libraryItems: LibraryItem[]
      ├── libraryItemsIdMap: Record<string, LibraryItem>
      ├── clickTracks: ClickTrack[]
      └── getAllSessions: () => void
         ↓
      ├── SessionForm
      │   ├── form: Session
      │   ├── valueChange: (form: Session) => void
      │   └── handleRemoveClickTrack: (id: string) => void
      │
      └── SessionBuilderSidebar
          ├── libraryItems: LibraryItem[]
          ├── libraryItemsIdMap: Record<string, LibraryItem>
          ├── clickTracks: ClickTrack[] (filtered)
          ├── searchType: string
          ├── handleSearch, handleSearchType, handleAddClickTrack
```

**Key behaviors:**

- Sessions are ordered lists of click tracks
- Sidebar lets you search/filter available click tracks by name, library item name, or category
- Adding a click track appends it to the session's array
- Session totals (time, counts) recalculated via `addSessionTotals()` on every change
- List view supports URL search parameter filtering

---

### 4. Player

**Purpose:** Plays back a session's click tracks sequentially using Web Audio API metronome.

**Component tree:**

```
Player (root — fetches sessions + library items)
└── PageWrapper
    └── PlayerSessionList (list of sessions with play buttons)
        └── PlayerLiveSession (active playback UI — conditionally rendered)
            └── MUI Slider (timeline — partially implemented)
```

**Props flow:**

```
Player
  └── PlayerSessionList
      ├── sessions: Session[]
      └── libraryItemsIdMap: Record<string, LibraryItem>
         ↓
      PlayerLiveSession
         ├── liveSession: Session
         └── libraryItemsIdMap: Record<string, LibraryItem>
```

**Key behaviors:**

- Selecting a session builds a `metronomeMapArray` — one metronome map per click track in the session
- Each metronome map is a `Record<number, MetronomeMapItem>` mapping beat count to {pitch, tempo, beatType, time}
- Playback uses the `Metronome` class (Web Audio API with lookahead scheduler pattern)
- The metronome calls back into React on each beat to update display state
- After a click track finishes, 3-second delay before advancing to next
- Timeline/scrubbing was partially implemented but not finished

---

## SHARED COMPONENTS

| Component              | Purpose                                                                 |
| ---------------------- | ----------------------------------------------------------------------- |
| **Layout**             | Main app shell with Header and Navbar sidebar                           |
| **PageWrapper**        | Single-column page wrapper                                              |
| **PageWrapperSidebar** | Two-column layout (main + sidebar)                                      |
| **PageHeader**         | Back button + action buttons (save)                                     |
| **DesktopToolbar**     | "New" button + search text field                                        |
| **ItemCard**           | Reusable card with title, time display, content area, and action menu   |
| **CardContentItem**    | Icon + label display row inside ItemCard                                |
| **ItemMenu**           | Dropdown menu for card actions (edit, delete, copy, info)               |
| **Empty**              | Empty state message                                                     |
| **BackButton**         | Navigation back button                                                  |
| **TimeSignatureSelect**| Two dropdowns for time signature (top: 1-16, bottom: 4/8/16)           |

---

## UTILITY FUNCTIONS (CRITICAL BUSINESS LOGIC)

### `addClickTrackTotals(clickTrack, libraryItem) → ClickTrack`

Calculates totalCounts, totalTimeDisplay, and totalTimeMilliseconds for a click track and each of its items. Core formula per item depends on durationType:

- **reps:** `countIn + (totalMeasures × beats × duration) + (countsBetween × (duration - 1))` (note: with time sig changes via `timeSigChangeMeasureItems`, this needs to sum beats per measure group rather than using a single time sig)
- **counts:** `countIn + duration`
- **measures:** `countIn + (duration × timeSignatureTop)`
- **minutes:** `countIn + (tempo × duration)`
- **seconds:** `countIn + (tempo × duration / 60)`

Time conversion: `(counts / tempo) × 60 × 1000` milliseconds

### `addSessionTotals(session, clickTracks) → Session`

Sums totalCounts and totalTimeMilliseconds across all click tracks in a session.

### `getTotalTimeDisplay(totalTimeMs) → string`

Formats milliseconds as `HH:MM:SS`.

### `getMetronomeMap(clickTrack, libraryItemsIdMap) → Record<number, MetronomeMapItem>`

Converts a click track into a beat-by-beat map for the metronome. For each item:

1. Generates count-in beats (high/low pitch pattern from `countInMap`)
2. Main beats (high on beat 1, low otherwise)
3. Counts-between beats (high pitch, only between reps)
4. Tracks cumulative time
5. Ends with a final "release" click

**Known limitation:** `countInMap` only has an entry for count-in length of 8 — needs expanding for other lengths.

### `Metronome` class (Web Audio API)

Lookahead scheduler pattern:

- Creates short oscillator tones at precise intervals
- Frequency map: high=1000Hz, medium=900Hz, low=800Hz, none=0Hz
- `start(metronomeMap, callback)` — begins playback, calls callback on each beat with current count
- `stop()` — stops playback, resets state
- Scheduling: 25ms polling interval, 100ms lookahead window

### `getTimelineIndexObject(clickTracks) → Record<number, { value, offset }>`

Maps seconds to beat indices for timeline UI. **Status: incomplete/unused.**

### Time signature constants

- Top number options: 1 through 16
- Bottom number options: [4, 8, 16]

---

## API LAYER

Three API service objects, all using native `fetch()` against a configurable base URL (was `http://localhost:3001/api`):

| Service        | Endpoint       | Methods                          |
| -------------- | -------------- | -------------------------------- |
| `libraryItemApi` | `/libraryItems` | GET all, POST create, PUT edit, DELETE |
| `clickTrackApi`| `/clickTracks` | GET all, POST create, PUT edit, DELETE |
| `sessionApi`   | `/sessions`    | GET all, POST create, PUT edit, DELETE |

All follow the same pattern: simple CRUD, JSON request body, `Content-Type: application/json`, console.log error handling only.

---

## ARCHITECTURAL PATTERNS & NOTES FOR REBUILD

### What worked

1. **Domain model is solid** — ClickTrack / ClickTrackItem / LibraryItem / Session map cleanly to the problem domain
2. **Component decomposition is reasonable** — each builder follows a consistent List/Detail/Form/Dialog pattern
3. **The totals calculation logic** (`addClickTrackTotals`) is the most important business logic and is well-separated into a utility
4. **Metronome lookahead scheduler** is the correct pattern for Web Audio API timing

### What to improve

1. **No global state** — everything is local useState with prop drilling. Library items, click tracks, and sessions are fetched redundantly on every page mount. Consider context or a store.
2. **Models are co-located** with their primary component in v1. v2 moved them to a shared `model/` directory — follow the v2 approach.
3. **The metronome is a plain JS class** — works but awkward to integrate with React state. Consider wrapping in a custom hook.
4. **countInMap** only handles count-in of 8 — needs expanding for flexibility.
5. **get-timeline.ts** and **get-metronome-click-times.ts** are incomplete stubs — timeline scrubbing was in progress.
6. **Error handling** is console.log only — no user-facing error states.
7. **No loading/error states** in most components — just loading booleans that gate rendering.
8. **No form validation** — forms accept any input.
9. **Landing/Dashboard page is empty** — placeholder only.
10. **MUI dark theme** with custom palette: primary=#989898, secondary=#cfe9ff, error=#ff5c61.

### Data flow summary

```
API (REST)
  ↕ fetch()
API Services (libraryItemApi, clickTrackApi, sessionApi)
  ↕ called in root components on mount
Root Components (ClickTrackBuilder, LibraryItemList, SessionBuilder, Player)
  ↕ useState + props
Child Components (Lists, Forms, Dialogs, Cards)
  ↕ callback props for mutations
Utility Functions (addClickTrackTotals, getMetronomeMap, Metronome class)
```
