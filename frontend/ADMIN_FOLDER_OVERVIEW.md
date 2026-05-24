# Admin Folder Overview

This document explains the `src/pages/admin` folder in the Workforce frontend, including the admin dashboard structure, routing, key components, state/hooks, and render logic.

## Folder Structure

- `src/pages/admin/AdminDashboard.jsx`
- `src/pages/admin/AdminShell.jsx`
- `src/pages/admin/AdminOverview.jsx`
- `src/pages/admin/AdminJobSeekers.jsx`
- `src/pages/admin/AdminEmployers.jsx`
- `src/pages/admin/AdminPrograms.jsx`  
- `src/pages/admin/AdminPlacements.jsx`
- `src/pages/admin/AdminReports.jsx`
- `src/pages/admin/components/AdminStatsCards.jsx`
- `src/pages/admin/components/AdminTable.jsx`
- `src/pages/admin/components/StatusBadge.jsx`

## Routing and Render Flow

The admin dashboard is mounted in `src/App.jsx` under the protected route `/dashboard/admin`:

- `/dashboard/admin` → `AdminDashboard`
- `/dashboard/admin/jobseekers` → `AdminJobSeekers`
- `/dashboard/admin/employers` → `AdminEmployers`
- `/dashboard/admin/programs` → `AdminPrograms`
- `/dashboard/admin/placements` → `AdminPlacements`
- `/dashboard/admin/reports` → `AdminReports`
- index route under `AdminDashboard` → `AdminOverview`

### AdminDashboard

`AdminDashboard.jsx` is the main wrapper for admin pages.

What it does:
- Wraps content with `AppLayout` to provide the shared app shell and top navigation.
- Displays a button-based submenu for admin sections.
- Uses React Router's `<Outlet />` to render the selected child page.

When it is rendered:
- Any admin route under `/dashboard/admin` renders `AdminDashboard` first.
- The child page is inserted into the `Outlet`.

### AdminShell

`AdminShell.jsx` is a lightweight wrapper that also uses `AppLayout`. It is currently not referenced by the route config.

## Shared Admin Components

### `AdminStatsCards.jsx`

- A presentational component that renders a list of statistic cards.
- Receives `stats` as props.
- Used in `AdminOverview.jsx`.

### `AdminTable.jsx`

- A reusable table component.
- Accepts `columns`, `rows`, `emptyText`, and an optional `renderRowActions` callback.
- Renders a header row from `columns` and each row with `c.render(row)` when provided.
- Adds a final actions column when `renderRowActions` is supplied.
- Used in multiple admin pages for listing employers, job seekers, and placements.

### `StatusBadge.jsx`

- Converts a `status` string into a styled badge.
- Supports statuses like `ACTIVE`, `INACTIVE`, `PENDING`, `COMPLETED`, and `CREATED`.
- Used across admin pages to display status consistently.

## Admin Page Breakdown

### `AdminOverview.jsx`

Purpose:
- Show a snapshot of system metrics for the admin.

State and hooks:
- `loading` — indicates data is loading.
- `cards` — stores card data for overview stats.
- `useEffect` — fetches all job seekers, employers, applications, and placements once after mount.

Logic:
- Calls four admin API endpoints in parallel.
- Normalizes responses into arrays.
- Builds four summary cards:
  - Job seeker counts by status.
  - Employer counts by status.
  - Total applications.
  - Total placements.

Render:
- While loading, shows a spinner.
- Once loaded, renders `AdminStatsCards`.

### `AdminJobSeekers.jsx`

Purpose:
- Manage job seeker verification and view details.

State and hooks:
- `jobSeekers` — list of job seekers.
- `loading` — data fetch state.
- `error` — error message if loading or actions fail.
- `detailOpen` — whether the detail modal is visible.
- `detailMode` — either `documents` or `applications`.
- `detailLoading` — modal-specific loading state.
- `detailData` — documents or applications shown in the modal.
- `useEffect` — loads job seekers once on mount.

Logic:
- `fetchDetails(mode, seeker)` loads documents or applications for a selected seeker.
- `handleToggleStatus(seeker, nextStatus)` switches seeker status using the admin API.

Render:
- `AdminTable` with columns for name, contact, status, and DOB.
- Row actions include Activate/Deactivate and two buttons to view documents or applications.
- A modal opens when `detailOpen` is true to display either documents or job applications.

### `AdminEmployers.jsx`

Purpose:
- Manage employer verification and approval.

State and hooks:
- `employers` — employer list.
- `loading` — fetch state.
- `error` — error state.
- `useEffect` — loads employers once on mount.

Logic:
- `handleStatusChange(employer, nextStatus)` updates the employer status.
- After update, it mutates the local `employers` list to reflect the new status.

Render:
- `AdminTable` with employer rows.
- Row actions to Approve or Reject each employer.

### `AdminPrograms.jsx`

Purpose:
- View training programs and program enrollments.

State and hooks:
- `programs` — program list.
- `loading` — loading indicator.
- `hoverId` — used to show action buttons when a card is hovered.
- `detailsOpen` / `details` — separate modal for program details.
- `enrollmentsOpen` / `enrollments` — separate modal for enrollments.
- `updatingId` — indicates which enrollment is currently being updated.
- `useEffect` — loads programs once after mount.

Logic:
- `openDetails(programId)` fetches one program by ID and opens the details modal.
- `openEnrollments(programId)` loads enrollments for one program and opens the enrollments modal.
- `changeEnrollmentStatus(enrollmentId, status)` updates an enrollment status (only for program managers by role logic) and updates local state.

Render:
- Cards for each program.
- Action buttons appear on hover: View Program Details and View Enrollments.
- Two modals: one for details, one for enrollment list.

### `AdminPlacements.jsx`

Purpose:
- Monitor placements and manage placement lifecycle.

State and hooks:
- `placements` — placement list.
- `loading` — data fetch state.
- `error` — error messages.
- `useEffect` — loads placements once on mount.

Logic:
- `handleMarkCompleted(placement)` updates placement status to `CONFIRMED`.
- `handleDelete(placement)` removes a placement.
- Both actions update local state after success.

Render:
- `AdminTable` with placement rows.
- Row actions include Mark Completed and Delete.

### `AdminReports.jsx`

Purpose:
- Display admin analytics and reporting dashboards.

State and hooks:
- `loading` — data fetch state.
- `error` — error message.
- `r` — report results object.
- `useEffect` — loads all report endpoints once after mount.

Logic:
- Requests five report endpoints in parallel.
- Builds chart data and KPI cards from returned report fields.
- Supports job application metrics, placement summary, training program metrics, employer stats, and compliance data.

Render:
- If loading, shows a spinner.
- If error, shows an alert.
- Otherwise, renders multiple sections with charts and KPI cards.

## App Layout and Admin Navigation

The admin pages render inside the shared `AppLayout` shell.

`AppLayout.jsx` provides:
- A persistent sidebar with role-specific navigation.
- A collapsible sidebar.
- A topbar with page title, notifications, avatar, and logout.
- Uses `getRole()` and `getUsername()` from `src/utils/tokenStorage`.

For admins, the sidebar navigation includes links to admin sections and also a generic dashboard link.

## Summary

- `AdminDashboard.jsx` is the admin route wrapper and renders the subpage via `<Outlet />`.
- `AdminOverview.jsx` is the admin landing summary page.
- `AdminJobSeekers.jsx`, `AdminEmployers.jsx`, `AdminPrograms.jsx`, `AdminPlacements.jsx`, and `AdminReports.jsx` are the main admin feature pages.
- Shared components are `AdminStatsCards`, `AdminTable`, and `StatusBadge`.
- Most admin pages use `useEffect` to fetch initial data when the page loads.
- Local state is used for loading, error handling, modal visibility, and row-specific actions.
- `AdminShell` exists but is not used by current routes.

## What Triggers Each Page

- Navigating to `/dashboard/admin` renders `AdminOverview`.
- Navigating to `/dashboard/admin/jobseekers` renders `AdminJobSeekers`.
- Navigating to `/dashboard/admin/employers` renders `AdminEmployers`.
- Navigating to `/dashboard/admin/programs` renders `AdminPrograms`.
- Navigating to `/dashboard/admin/placements` renders `AdminPlacements`.
- Navigating to `/dashboard/admin/reports` renders `AdminReports`.

Each admin page loads its own data independently, so the data fetch and render flow is isolated by page.

---

If you want, I can also create a second markdown file describing the admin API usage and how the admin pages talk to `src/api/adminApi.js`.