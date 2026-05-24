# Auditor Module — Deep Explain (API Flow + React Concepts)

This document explains the **Auditor** side of your frontend in the same interview style as Officer/Admin: what each Auditor file does, how each API call is routed through Axios config + token storage, and what React concepts each file uses.

---

## 0) Big Picture: what the Auditor UI does
The **Auditor** role is built around a “evidence → conclusion” workflow:

1. **Fetch system reports (evidence)**
2. **View those reports**
3. **Create an Audit** based on a selected report scope
4. **See existing Audit records**

In your code, this is implemented in:

- `src/pages/auditor/AuditorDashboard.jsx`
- UI components in `src/pages/auditor/components/*`
- API layer in `src/api/auditorApi.js`
- Shared HTTP layer in `src/api/axiosConfig.js`
- Shared auth in `src/utils/tokenStorage.js`

---

## 1) Auth & Axios: how every Auditor API call works internally
Auditor APIs call `axiosInstance` from `src/api/axiosConfig.js`, so the full request pipeline is the same as Officer:

### 1.1 Token storage
**File:** `src/utils/tokenStorage.js`
- Stores token in `localStorage` under `workforce_token`
- Stores role under `workforce_role`
- Exposes:
  - `getToken()`
  - `getRole()`
  - `clearAuthData()`

**Why Auditor cares:** Axios will read the token for Authorization.

### 1.2 Axios config (interceptors)
**File:** `src/api/axiosConfig.js`
Every Auditor request goes through:

1) **Request interceptor**
- sets `config.baseURL = import.meta.env.VITE_BACKEND_URL`
- reads token via `getToken()`
- attaches header:
  - `Authorization: Bearer <token>`

2) **Response interceptor**
- normalizes response to `response.data.data` if present
- otherwise returns `response.data`

3) **Error interceptor**
- on HTTP 401:
  - clears auth
  - redirects to `/login`

### 1.3 What that means for React components
In your components, you typically do:

```js
const res = await someAuditorApiCall();
setState(res);
```

Because Axios already returns the normalized payload, your components don’t need to know whether backend returned `{ data: ... }` or `{ ... }`.

---

## 2) Auditor API layer: every API call in `src/api/auditorApi.js`
**File:** `src/api/auditorApi.js`

All functions are thin wrappers over `axiosInstance`.

### 2.1 `createAudit(payload)`
```js
axiosInstance.post('/audits/create', payload)
```
- Called by: `AuditorDashboard.jsx` when the auditor submits the modal
- Purpose: persist auditor conclusion (findings/observations) into backend

**Payload shape (from UI):**
- `scope`
- `findings`

### 2.2 `getAllAudits()`
```js
axiosInstance.get('/audits')
```
- Called by: `AuditorDashboard.jsx`
- Purpose: fetch list of existing audit records

### 2.3 `getAuditById(auditId)`
```js
axiosInstance.get(`/audits/${auditId}`)
```
- Present in API layer but not used in the reviewed components
- Purpose: retrieve a specific audit record

### 2.4 Evidence/report analytics
These endpoints are used to build the “System Reports (Evidence)” section.

#### `getJobApplicationAnalytics()`
```js
axiosInstance.get('/reports/job-applications')
```

#### `getTrainingAnalytics()`
```js
axiosInstance.get('/reports/training')
```

#### `getPlacementAnalytics()`
```js
axiosInstance.get('/reports/placements')
```

#### `getComplianceAnalytics()`
```js
axiosInstance.get('/reports/compliance')
```

- Called by: `AuditorDashboard.jsx` in `Promise.all([...])`
- Purpose: provide evidence objects/metrics to display

---

## 3) Auditor UI folder: every file under `src/pages/auditor/`

### 3.1 `AuditorDashboard.jsx` — main orchestrator
**Purpose (interview summary):**
This is the “container component” that:
- fetches report evidence
- fetches audit records
- manages loading/error states
- controls the “Create Audit” modal
- wires data into `ReportsOverview` and `AuditList`

#### Important React state
- `reportsLoading`, `auditsLoading`
- `reports` stored as an object:
  - `jobApplications`, `training`, `placements`, `compliance`
- `audits` array
- `error`
- modal control:
  - `showCreateModal`
  - `modalScope` (which domain the audit will be created for)
  - `isSubmittingAudit`

#### Key data fetching flows
##### A) Fetch reports concurrently
```js
const [jobApps, training, placements, compliance] = await Promise.all([
  getJobApplicationAnalytics(),
  getTrainingAnalytics(),
  getPlacementAnalytics(),
  getComplianceAnalytics(),
]);
```
**React concepts:**
- `useCallback` memoizes `fetchReports`
- `useEffect(() => { fetchReports(); fetchAudits(); }, ...)` triggers on mount
- `Promise.all` improves performance by not waiting sequentially

##### B) Fetch audits
```js
const res = await getAllAudits();
setAudits(Array.isArray(res) ? res : res?.audits || []);
```
**Why the defensive check matters:** backend response format may differ.

#### Modal workflow
##### 1) When user clicks an evidence card
- `handleCreateAuditFromReport(scope)` sets:
  - `modalScope = scope`
  - `showCreateModal = true`

##### 2) When user submits
- `handleSubmitAudit({ scope, findings })`
  - calls `createAudit({ scope, findings })`
  - closes modal
  - refreshes audit list by calling `fetchAudits()`

#### React concepts used (must mention in interview)
- `useState` for UI orchestration
- `useEffect` for “load on mount”
- `useMemo` for derived state (`canShowReports`)
- `useCallback` to prevent unnecessary function re-creation
- Conditional rendering:
  - show `ReportsOverview` only if not loading
  - show loading placeholder text otherwise

---

### 3.2 `components/ReportsOverview.jsx` — builds report cards
**What it receives:**
- `reports` (object with domain metrics)
- `onCreateAudit(scope)` callback

**How it works internally:**
- defines `DOMAIN_CONFIG` mapping domain → icon/title
- builds a `cards` array via `useMemo`
- each card renders a `ReportCard`.

**React concepts used:**
- `useMemo` to avoid recreating the cards array on every render
- composition pattern:
  - parent computes card config
  - `ReportCard` purely renders

---

### 3.3 `components/ReportCard.jsx` — evidence presentation + action button
**Props:**
- `domain`, `icon`, `title`, `status`, `metrics`, `actionLabel`, `onAction`

**Key logic:**
- `metricEntries = metrics && typeof metrics === 'object' ? Object.entries(metrics) : []`
- shows up to first 6 metrics rows:
  - `slice(0, 6)`
- value formatting:
  - if value is object → `JSON.stringify(v)`
  - else `String(v)`

**React concepts used:**
- Stateless functional component (pure render)
- Defensive rendering when `metrics` is missing

---

### 3.4 `components/AuditList.jsx` — list of audits
**Props:** `audits` array

**Behaviour:**
- if no audits, returns `EmptyState`
- otherwise maps `audits` into `AuditCard` components

**React concepts used:**
- conditional rendering (empty vs list)
- array mapping + `key` usage

---

### 3.5 `components/AuditCard.jsx` — audit record display
**Props:** `audit`

**Key UI derivations (important minute details):**
- `scope` extracted from multiple possible fields:
  - `audit?.scope || '-'`
- `findings` extracted from possible observation fields:
  - `findings || observations || observation`
- compliance status extracted from possible fields:
  - `complianceStatus || compliance_status || status`

**Status color:**
- `getStatusColor(status)` does `includes()` checks:
  - pass/approved/compliant → green
  - fail/non/violation → red
  - pending/in progress → gray
  - default → teal

**React concepts used:**
- pure render + helper functions
- defensive field normalization

---

### 3.6 `components/CreateAuditModal.jsx` — evidence-to-conclusion form
**Props:**
- `show` (boolean)
- `initialScope` (domain)
- `isSubmitting`
- `onClose`
- `onSubmit({ scope, findings })`

**Important internal behavior:**
- local state:
  - `scope`
  - `findings`
- `useEffect` runs when modal is shown:
  - sets `scope = initialScope || 'APPLICATION'`
  - clears findings

**Can submit validation (derived state):**
- `canSubmit = findings.trim().length > 0`
- implemented via `useMemo` (small optimization)

**Modal open/close:**
- if `!show` → `return null` (unmounts modal)
- otherwise renders with bootstrap-like modal markup and `style={{ display: 'block' ... }}`

**React concepts used:**
- controlled form inputs (`value={...}` + `onChange`)
- `useEffect` to sync props→local state when modal opens
- conditional rendering

---

### 3.7 `components/EmptyState.jsx` — shared empty UI
Simple stateless component:
- optional icon render
- shows message

---

## 4) End-to-end flow examples

### Example A: Creating an audit from reports (full chain)
1. `AuditorDashboard` mounts and runs:
   - `fetchReports()` (Promise.all of 4 endpoints)
   - `fetchAudits()`
2. `ReportsOverview` renders evidence cards.
3. User clicks “Create Audit Based on This Report” on a card.
4. `handleCreateAuditFromReport(scope)` sets:
   - `modalScope = scope`
   - `showCreateModal = true`
5. Modal opens → user enters findings.
6. User submits:
   - `createAudit({ scope, findings })`
7. On success:
   - modal closes
   - `fetchAudits()` reloads audit list.

### Example B: How a single API call reaches the backend
For any call like:
- `getPlacementAnalytics()` → `axiosInstance.get('/reports/placements')`

Internal pipeline:
- Request interceptor attaches:
  - `baseURL = VITE_BACKEND_URL`
  - `Authorization: Bearer <token>`
- Response interceptor returns normalized payload.
- React sets `reports.placements`.

---

## 5) React concepts checklist (Auditor-specific)
Mention these during interview:
- Orchestration container pattern (`AuditorDashboard` controls flow)
- Concurrent fetching with `Promise.all`
- `useCallback` and `useMemo` for stable references and derived state
- Conditional rendering for loading vs loaded UI
- Modal lifecycle sync using `useEffect` (when `show` toggles)
- Controlled form inputs inside modal
- Defensive normalization of backend response formats

---

## 6) Auditor file list (for quick reference)
- `src/pages/auditor/AuditorDashboard.jsx`
- `src/pages/auditor/components/ReportsOverview.jsx`
- `src/pages/auditor/components/ReportCard.jsx`
- `src/pages/auditor/components/AuditList.jsx`
- `src/pages/auditor/components/AuditCard.jsx`
- `src/pages/auditor/components/CreateAuditModal.jsx`
- `src/pages/auditor/components/EmptyState.jsx`

API + shared infrastructure:
- `src/api/auditorApi.js`
- `src/api/axiosConfig.js`
- `src/utils/tokenStorage.js`

