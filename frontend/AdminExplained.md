# Admin Area (Updated: Current Repo Logic)

This document explains the **Admin flow** and **every Admin file** currently present in the repo (including how routes render, roles involved, rendering logic, and the end-to-end flow).

## Scope (Admin)
- `src/App.jsx` (admin routes to `/dashboard/admin/*`)
- `src/api/adminApi.js` (admin API calls)
- `src/api/axiosConfig.js` (axios interceptors + auth)
- `src/pages/admin/AdminDashboard.jsx`
- `src/pages/admin/AdminShell.jsx`
- `src/pages/admin/AdminOverview.jsx`
- `src/pages/admin/AdminEmployers.jsx`
- `src/pages/admin/AdminJobSeekers.jsx`
- `src/pages/admin/AdminPlacements.jsx`
- `src/pages/admin/AdminPrograms.jsx`
- `src/pages/admin/AdminReports.jsx`
- `src/pages/admin/components/AdminStatsCards.jsx`
- `src/pages/admin/components/AdminTable.jsx`
- `src/pages/admin/components/StatusBadge.jsx`

---

## Big picture: how Admin pages work

### 1) Routing entry point
Admin routes are defined in **`src/App.jsx`**:
- `/dashboard/admin` → nested route that renders `AdminDashboard` shell + child routes.
- `/dashboard/admin/jobseekers` → child route renders `AdminJobSeekers` inside the dashboard layout.
- `/dashboard/admin/employers` → child route renders `AdminEmployers`.
- `/dashboard/admin/programs` → child route renders `AdminPrograms`.
- `/dashboard/admin/placements` → child route renders `AdminPlacements`.
- `/dashboard/admin/reports` → child route renders `AdminReports`.

In `App.jsx`:
- `AdminDashboard` is mounted for all admin sub-routes.
- `<Outlet />` inside `AdminDashboard` determines which admin page component appears.

### 2) Shared authorization model (roles)
Role checks are done mostly inside pages using `getRole()`.

Admin role(s) that appear in code:
- **`ADMIN`**: can view Overview, Employers, Job Seekers, Placements, Reports.
- **`PROGRAM_MANAGER`**: can also view Programs (`AdminPrograms`) and update enrollment status.

### 3) Layered architecture
1. **API layer**: `src/api/adminApi.js`
2. **HTTP client layer**: `src/api/axiosConfig.js` (token + error handling)
3. **Page layer**: `src/pages/admin/*.jsx` (fetch + state + UI)
4. **Reusable UI**: `src/pages/admin/components/*.jsx`

---

## End-to-end data flow (Admin)

## React concepts used in Admin (easy + file-wise)

### Hooks (what they do in this project)

- **useState**: stores data like lists (`employers`, `jobSeekers`), UI flags (`loading`, `error`), and modal state.
- **useEffect**: runs side-effects like fetching data after the component mounts.
- **useMemo**: creates stable “configuration objects” (like table columns) so they aren’t recreated on every render.

### Other React concepts (easy)

- **Conditional rendering**: `loading ? <Spinner/> : <Table/>`, `if (role !== 'ADMIN') return null`, etc.
- **Props**: parent passes data/functions to child components.
- **List rendering**: `.map()` renders rows/cards.
- **State updates**: after API success, UI updates with `setX(prev => prev.map(...))` or `prev.filter(...)`.

### File-wise mapping of hooks/concepts

- **`src/pages/admin/AdminDashboard.jsx`**
  - No hooks inside this file.
  - React concept: **layout component** + `<Outlet />`.

- **`src/pages/admin/AdminOverview.jsx`**
  - `useState`: `loading`, `cards`
  - `useEffect`: fetch overview snapshot with `Promise.all`
  - Conditional rendering: spinner vs `AdminStatsCards`

- **`src/pages/admin/AdminEmployers.jsx`**
  - `useState`: `employers`, `loading`, `error`
  - `useEffect`: fetch employers list
  - `useMemo`: column definitions for `AdminTable`
  - Conditional rendering: `if (role !== 'ADMIN') return null`
  - State updates: approve/reject uses `setEmployers(prev => prev.map(...))`

- **`src/pages/admin/AdminJobSeekers.jsx`**
  - `useState`: list + modal state (`detailOpen`, `detailMode`, `detailLoading`, `detailData`)
  - `useEffect`: fetch job seekers list
  - `useMemo`: table columns
  - Conditional rendering: modal content depending on `detailMode` + loading/empty
  - State updates:
    - toggle active/inactive updates list via `setJobSeekers(prev => prev.map(...))`
    - modal fetch stores documents/applications into `detailData`

- **`src/pages/admin/AdminPlacements.jsx`**
  - `useState`: `placements`, `loading`, `error`
  - `useEffect`: fetch placements list
  - `useMemo`: table columns
  - Conditional rendering: spinner vs `AdminTable`, action button shown/hidden by status
  - State updates:
    - mark completed uses `map` to update status
    - delete uses `filter` to remove row

- **`src/pages/admin/AdminPrograms.jsx`**
  - `useState`: `programs`, `loading`, `hoverId`, and modal states (`detailsOpen`, `details`, `enrollmentsOpen`, `enrollments`, `updatingId`)
  - `useEffect`: fetch programs list
  - Conditional rendering:
    - hover controls show buttons only for the hovered card
    - enrollments modal shows table only when `enrollments` exists
    - dropdown only shown for program manager
  - State updates:
    - enrollment status update updates `enrollments` via `map`

- **`src/pages/admin/AdminReports.jsx`**
  - `useState`: `loading`, `error`, `reports`
  - `useEffect`: fetch 5 datasets in parallel (`Promise.all`)
  - List rendering: `charts.map(...)` renders multiple chart cards
  - Conditional rendering:
    - spinner vs charts
    - if chart data values are all zero → “No data available”

- **Admin components**
  - `src/pages/admin/components/AdminStatsCards.jsx`
    - Props: `stats`
    - List rendering: maps cards to UI blocks
  - `src/pages/admin/components/AdminTable.jsx`
    - Props: `columns`, `rows`, `emptyText`, `renderRowActions`
    - Conditional rendering: shows empty row when `rows` is empty
    - Uses `columns.map` to render headers and cells
  - `src/pages/admin/components/StatusBadge.jsx`
    - Props: `status`
    - Simple conditional mapping from status → Bootstrap badge classes

---

## End-to-end data flow (Admin)

### A) Example: Admin loads Employers list

1. User opens: `/dashboard/admin/employers`
2. `src/App.jsx` matches nested admin route:
   - `AdminDashboard` mounts (layout + nav + `<Outlet />`).
3. React renders `AdminEmployers` inside the outlet.
4. `AdminEmployers` does:
   - reads `role = getRole()`
   - if role is not `ADMIN` → `navigate('/login')` and returns `null`
5. `useEffect` triggers API call:
   - `getAllEmployers()` from `src/api/adminApi.js`
6. `axiosInstance` (from `src/api/axiosConfig.js`) applies:
   - `config.baseURL = VITE_BACKEND_URL`
   - `Authorization: Bearer <token>` (if available)
7. Response interceptor returns `response.data.data` (if nested), otherwise returns `response.data`.
8. `AdminEmployers` stores the result in `employers` state.
9. Render uses:
   - `AdminTable columns/rows`
   - status formatting uses `StatusBadge`.

### B) Example: Admin Approves/Rejects an Employer
1. Click a button in the `renderRowActions` cell inside `AdminEmployers`.
2. `handleStatusChange(employer, nextStatus)` calls:
   - `updateEmployerStatus(employer.employerID, nextStatus)`
3. After API success, UI updates immediately via:
   - `setEmployers(prev => prev.map(...))`

---

## Rendering / role flow diagram (text)

### Route → component rendering

```
App.jsx
└─ <Route path="/dashboard/admin" element={<AdminDashboard .../>}>
   ├─ (index)            → <AdminOverview />
   ├─ /jobseekers        → <AdminJobSeekers />
   ├─ /employers        → <AdminEmployers />
   ├─ /programs         → <AdminPrograms />
   ├─ /placements       → <AdminPlacements />
   └─ /reports          → <AdminReports />

AdminDashboard
└─ renders navigation + <Outlet />

Each child page mounts and performs role guard internally.
```

### When do other files render in the flow?

- `AdminDashboard.jsx` always renders for `/dashboard/admin/*` because it is the parent route element.
- `AdminOverview.jsx` renders when the URL is exactly `/dashboard/admin` (index route).
- `AdminJobSeekers.jsx` renders only for `/dashboard/admin/jobseekers`.
- `AdminEmployers.jsx` renders only for `/dashboard/admin/employers`.
- `AdminPrograms.jsx` renders only for `/dashboard/admin/programs`.
- `AdminPlacements.jsx` renders only for `/dashboard/admin/placements`.
- `AdminReports.jsx` renders only for `/dashboard/admin/reports`.

Reusable components rendering:
- `AdminTable.jsx` renders inside the pages that list rows:
  - `AdminEmployers`, `AdminJobSeekers`, `AdminPlacements`
- `StatusBadge.jsx` renders wherever a status pill is needed:
  - `AdminEmployers`, `AdminJobSeekers` (job seeker document/application items), `AdminPlacements`, `AdminPrograms`, `AdminReports`
- `AdminStatsCards.jsx` renders inside `AdminOverview.jsx` after the snapshot fetch completes.

---

## File-by-file (Admin) with roles + rendering details

### 1) `src/App.jsx`
**Role / purpose**: Defines route map for all admin pages.

**Admin routes**:
- Parent: `/dashboard/admin` uses `<ProtectedRoute allowedRoles={['ADMIN']}>` and renders `AdminDashboard`.
- Child routes:
  - index → `AdminOverview`
  - `jobseekers` → `AdminJobSeekers`
  - `employers` → `AdminEmployers`
  - `programs` → `AdminPrograms`
  - `placements` → `AdminPlacements`
  - `reports` → `AdminReports`

**How rendered**:
- `AdminDashboard` mounts first.
- `Outlet` then mounts the matching child.

### 2) `src/pages/admin/AdminDashboard.jsx`
**Role**: Admin dashboard layout (navigation + `<Outlet />`).

**Roles involved**: Primarily for display; role guard is handled in child pages (and partially in routing via `ProtectedRoute` in `App.jsx`).

**Rendering**:
- Creates NAV_LINKS.
- Uses `NavLink` to apply active styling.
- Renders `<Outlet />`.

### 3) `src/pages/admin/AdminShell.jsx`
**Role**: Present but not actively used in `App.jsx` currently.

**Roles**: Admin-only wrapper would gate via `getRole()` + redirect.

**Rendering**:
- If used elsewhere, it would wrap children in `AppLayout`.
- Current routing in `App.jsx` does not use `AdminShell` for admin pages.

### 4) `src/pages/admin/AdminOverview.jsx`
**Role**: Summary snapshot cards (stats).

**Roles involved**: checks happen inside the component indirectly (it does not do `getRole()` guard in the current version; instead, the route is already protected by `ProtectedRoute` in `App.jsx`).

**Data flow**:
- `useEffect` + `Promise.all` loads:
  - job seekers
  - employers
  - applications
  - placements
- Computes counts and sets `cards`.

**Rendering**:
- Loading state shows spinner/card.
- After load, renders `AdminStatsCards stats={cards}`.

### 5) `src/pages/admin/AdminEmployers.jsx`
**Role**: Employers verification panel (approve/reject).

**Allowed roles**:
- **ADMIN only** (`if role !== 'ADMIN' navigate('/login')`).

**State**:
- `employers`, `loading`, `error`

**Data flow**:
- `useEffect` → `getAllEmployers()` → `setEmployers(...)`

**Rendering**:
- `AdminTable` with columns (name/industry/status).
- `renderRowActions` shows:
  - Approve button (if not already APPROVED)
  - Reject button (if not already REJECTED)

**Actions update**:
- Calls `updateEmployerStatus(...)`.
- Updates local state using `map` (no full refetch).

### 6) `src/pages/admin/AdminJobSeekers.jsx`
**Role**: Job seeker management + detail modal (documents/applications).

**Allowed roles**:
- **ADMIN only**.

**State**:
- list: `jobSeekers`, plus `loading`, `error`
- modal:
  - `detailOpen`
  - `detailMode` = `'documents' | 'applications'`
  - `detailLoading`
  - `detailData`

**Data flow**:
- `useEffect` → `getAllJobSeekers()`
- When “View Documents” / “View Applications” clicked:
  - `fetchDetails(mode, seeker)`
  - calls either:
    - `getJobSeekerDocuments(seeker.seekerID)`
    - `getApplicationsByJobSeeker(seeker.seekerID)`

**Rendering**:
- `AdminTable` lists job seekers.
- Row actions show:
  - Activate/Deactivate buttons
  - View Documents / View Applications
- Modal:
  - spinner while loading
  - empty message when no data
  - documents: cards with document type/status + link
  - applications: cards with job title/employer/status

### 7) `src/pages/admin/AdminPlacements.jsx`
**Role**: Placement oversight (mark completed + delete).

**Allowed roles**:
- **ADMIN only**.

**State**:
- `placements`, `loading`, `error`

**Data flow**:
- `useEffect` → `getAllPlacements()`

**Actions**:
- Mark completed:
  - `updatePlacementStatus(placementId, 'CONFIRMED')`
  - updates local state
- Delete:
  - `deletePlacement(placementId)`
  - removes the row

**Rendering**:
- Uses `AdminTable` with a formatted `startDate` helper.
- `renderRowActions` shows Mark Completed button unless status is `CONFIRMED`.

### 8) `src/pages/admin/AdminPrograms.jsx`
**Role**: Training programs list + details + enrollments modal.

**Allowed roles (by code)**:
- UI shows for:
  - `ADMIN` and `PROGRAM_MANAGER`
- But update actions (enrollment status changes) are restricted:
  - `isProgramManager = role === 'PROGRAM_MANAGER'`
  - `changeEnrollmentStatus` returns early if not program manager

**State**:
- `programs`, `loading`
- `hoverId` for hover actions on program cards
- `detailsOpen/details`
- `enrollmentsOpen/enrollments`
- `updatingId` disables dropdown during update

**Data flow**:
- `useEffect` loads all programs via `getAllTrainingPrograms()`.
- Program details button:
  - `getTrainingProgramById(programId)`
- Enrollments button:
  - `getEnrollmentsByProgram(programId)`

**Rendering**:
- Card grid of programs.
- Modal #1: Program Details
- Modal #2: Program Enrollments (and status dropdown only for program manager)

### 9) `src/pages/admin/AdminReports.jsx`
**Role**: Reports & analytics (pie charts).

**Allowed roles**:
- **ADMIN only**.

**State**:
- `loading`, `error`, `reports`

**Data flow**:
- `useEffect` with `Promise.all` fetches:
  - job applications report
  - placements report
  - training report
  - employers report
  - compliance report

**Rendering**:
- Builds `charts[]` with computed `data` arrays.
- For each chart:
  - if `data` has non-zero values → render `recharts` PieChart
  - else shows “No data available”

---

## Admin API + axios interceptors (how data arrives)

### 1) `src/api/adminApi.js`
**Purpose**: Wraps backend endpoints.

Includes these calls used by admin pages:
- Employers:
  - `getAllEmployers()`
  - `updateEmployerStatus(employerId, status)`
- Job seekers:
  - `getAllJobSeekers()`
  - `getJobSeekerDocuments(jobSeekerId)`
  - `updateJobSeekerStatus(seekerId, status)`
  - `getApplicationsByJobSeeker(jobSeekerId)`
- Placements:
  - `getAllPlacements()`
  - `updatePlacementStatus(placementId, status)`
  - `deletePlacement(placementId)`
- Programs:
  - `getAllTrainingPrograms()`
  - `getTrainingProgramById(programId)`
  - `getEnrollmentsByProgram(programId)`
  - `updateEnrollmentStatus(enrollmentId, status)`
- Reports:
  - `getJobApplicationsReport()`
  - `getPlacementsReport()`
  - `getTrainingReport()`
  - `getEmployersReport()`
  - `getComplianceReport()`

### 2) `src/api/axiosConfig.js`
**Purpose**: Ensures every admin request:
- uses `VITE_BACKEND_URL` as baseURL
- attaches auth token (if available)
- normalizes data response
- handles 401 session expiry by clearing auth and redirecting to `/login`

---

## Notes / consistency checks
- `AdminPrograms` allows viewing for `PROGRAM_MANAGER` as well, but updates are restricted.
- `AdminShell.jsx` appears unused in current `App.jsx` routing; admin pages are currently directly rendered in `AdminDashboard` via `<Outlet />`.

---

## Quick glossary
- **Outlet**: where nested route components render inside a parent route.
- **ProtectedRoute**: router-level guard based on allowed roles.
- **useEffect**: runs side effects like fetching data after mount.
- **Optimistic UI update (local state)**: after successful API, UI updates without refetching the entire list.

