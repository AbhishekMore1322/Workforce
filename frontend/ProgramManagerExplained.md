# Program Manager Module — Deep Explain (API Flow + React Concepts + Data Workflow)

This file explains your **Program Manager** frontend in the same interview style you asked for for Officer/Auditor: 
- how auth + Axios requests work internally
- which API endpoints each Program Manager file calls
- how each React concept/state/derived data is used
- line-by-line style walkthrough at the component level (what happens in order)
- end-to-end data flow workflow (what the user does → what the UI calls → how state updates)

---

## 1) Big Picture: what Program Manager does
The Program Manager role manages **training programs** and **enrollment progress**.

In your frontend this breaks into screens:
1. Dashboard metrics: active programs, enrollments, completed trainings
2. List programs (view details + enrollments)
3. Create training program (form)
4. Program details (deactivate)
5. Program enrollments (update enrollment status)
6. Training reports (analytics dashboard)

All screens live under:
- `src/pages/programManager/*`

API calls live under:
- `src/api/programManagerApi.js`

Shared networking/auth is still:
- `src/api/axiosConfig.js`
- `src/utils/tokenStorage.js`

---

## 2) Shared auth + Axios pipeline (applies to all Program Manager API calls)

### 2.1 Token storage
**File:** `src/utils/tokenStorage.js`
- Token key: `workforce_token`
- Role key: `workforce_role`

**Why this matters:** Program manager screens use role guard functions to ensure the correct role and Axios uses the token for Authorization.

### 2.2 Axios config: request/response interceptors
**File:** `src/api/axiosConfig.js`
1. **Request interceptor**
   - sets `config.baseURL = import.meta.env.VITE_BACKEND_URL`
   - reads token via `getToken()`
   - attaches `config.headers.Authorization = Bearer <token>`

2. **Response interceptor**
   - returns `response.data.data` if defined
   - otherwise returns `response.data`

3. **Error interceptor**
   - on 401: clears auth and redirects to `/login`
   - on `error.response.data.message`: throws that message

So every API wrapper in `programManagerApi.js` automatically benefits from:
- baseURL + token injection
- response normalization
- consistent error handling with `try/catch`

---

## 3) Program Manager API layer — `src/api/programManagerApi.js`
This file is a “thin wrapper” layer.
It doesn’t manage UI state; it just calls endpoints using `axiosInstance`.

### 3.1 Endpoints
1. `getTrainingPrograms()`
   - GET `/training-programs`
   - used by: Dashboard (metrics indirectly), TrainingPrograms list screen

2. `createTrainingProgram(data)`
   - POST `/training-programs` with `data`
   - used by: CreateTrainingProgram form

3. `getEnrollmentsByProgram(programId)`
   - GET `/enrollments/program/${programId}`
   - used by: ProgramEnrollments screen

4. `updateEnrollmentStatus(enrollmentId, status)`
   - PATCH `/enrollments/${enrollmentId}/status` with query param `{ params: { status } }`
   - used by: ProgramEnrollments status selector

5. `updateTrainingProgramStatus(programId)`
   - PATCH `/training-programs/${programId}`
   - note: unlike enrollment status, this function does not include a status value in query/body.
   - used by: ProgramDetails (deactivate flow)

6. `getTrainingReport()`
   - GET `/reports/training`
   - used by: Dashboard + TrainingReports page

---

## 4) Role guard module — `src/pages/programManager/roleGuard.js`
This is your Program Manager access control.

### 4.1 Constants
- `PROGRAM_MANAGER_ROLE = 'PROGRAM_MANAGER'`

### 4.2 `requireProgramManagerRole(roleOverride)`
**Purpose:** returns `true` if the provided role (or stored role from tokenStorage) equals `PROGRAM_MANAGER`.

Internal sequence:
1. `const role = roleOverride ?? getRole();`
2. return `role === PROGRAM_MANAGER_ROLE`.

### 4.3 `ProgramManagerRedirect`
This component returns:
- `null` if role is not correct
- else returns `children`

(Used as a wrapper pattern in some setups; in the reviewed files, screens manually navigate to `/login`.)

---

## 5) Every Program Manager file explained (with workflow + concepts)

### 5.1 `ProgramManagerDashboard.jsx`
Location: `src/pages/programManager/ProgramManagerDashboard.jsx`

#### What it renders
- “Active Training Programs” count
- “Total Enrollments” count
- “Completed Trainings” count
- Buttons to navigate to create/list/reports screens

#### What API it calls
- `getTrainingPrograms()`
- `getTrainingReport()`

Both inside a `Promise.all`, so they run concurrently.

#### React concepts used
- `useState` for local UI state
  - `report` (raw report object)
  - `counts` (derived numbers shown in cards)
  - `loading`
- `useEffect` for initial loading
- `Promise.all` to fetch programs and report together
- `useMemo` for `statusHint`
- `useNavigate` for redirect buttons and role redirect

#### Internal workflow (step order)
1. Read role: `const role = getRole()`.
2. Create navigation: `const navigate = useNavigate()`.
3. On mount or when `[navigate, role]` changes:
   - if role guard fails: `navigate('/login', { replace: true })` and stop
   - else run `load()`
4. `load()` sets `loading=true`.
5. Concurrent fetch:
   - `getTrainingPrograms()` returns list
   - `getTrainingReport()` returns report metrics
6. Compute:
   - `activePrograms` = programs filtered by `status === 'ACTIVE'`
   - `totalEnrollments` supports multiple field names:
     - `r.totalEnrollments || r.total_enrollments || r.total`
   - `completedTrainings` supports multiple field names:
     - `r.completedEnrollments || r.completed_enrollments || r.completed`
7. `setReport(rpt)` + `setCounts({ ... })`.
8. In finally: `setLoading(false)`.

#### Important interview details
- Defensive programming for API shape variability.
- The UI cards use computed values (`counts`) rather than rendering raw report fields.

---

### 5.2 `TrainingPrograms.jsx`
Location: `src/pages/programManager/TrainingPrograms.jsx`

#### Purpose
Show all training programs with actions:
- View Details
- View Enrollments

#### API call
- `getTrainingPrograms()`

#### React concepts used
- `useEffect` for load-on-mount
- `useState` for `programs`, `loading`
- `useNavigate` for navigation with route state

#### Internal workflow
1. Get role and navigate.
2. On mount:
   - role guard failure → redirect to `/login`
   - else call `getTrainingPrograms()`
3. Convert response safely:
   - if array → use it
   - else → empty array
4. Render:
   - loading message if `loading`
   - empty alert if `programs.length === 0`
   - else map programs into `ProgramCard`

#### Data flow detail: navigation state
When you click a card action, you navigate like:
- `navigate('/.../program-details', { state: { program: p } })`

So ProgramDetails/ProgramEnrollments rely on `useLocation().state.program`.

---

### 5.3 `CreateTrainingProgram.jsx`
Location: `src/pages/programManager/CreateTrainingProgram.jsx`

#### Purpose
A form to create a new training program.

#### API call
- `createTrainingProgram(payload)`

#### React concepts used
- `useState` for form data + `submitting` + `error`
- `useMemo` for derived validation state (`datesOk`)
- controlled inputs:
  - input `value={form.title}`
  - input `onChange={handleChange}`
- `useNavigate` for redirect after success

#### Internal workflow (line-by-line style)
1. Initialize `form` state with title/description/startDate/endDate.
2. Compute `titleOk = form.title.trim().length >= 3`.
3. Compute `datesOk` with `useMemo`:
   - require both dates
   - parse both with `new Date(...)`
   - ensure both are valid dates
   - ensure end >= start
4. `canSubmit = titleOk && datesOk && !submitting`.
5. `handleChange(e)`:
   - destructures `name` and `value` from the input
   - updates only that field:
     - `setForm(prev => ({ ...prev, [name]: value }))`
6. `handleSubmit(e)` runs on form submit:
   - prevent default
   - role guard: if not program manager → redirect to `/login`
   - clear `error`
   - validate title/dates; if invalid → setError and return
   - setSubmitting(true)
   - build payload using trimmed title/description
   - call `createTrainingProgram(payload)`
   - on success navigate back to `/programs`
   - finally setSubmitting(false)

#### Why this is good for interviewer
- Clear separation: derived validation computed before API call.
- Controlled form → deterministic UI.

---

### 5.4 `ProgramDetails.jsx`
Location: `src/pages/programManager/ProgramDetails.jsx`

#### Purpose
Show program information and allow deactivation.

#### Data input source
- `const { state } = useLocation(); const program = state?.program;`

So if you refresh the page without router state, `program` may be missing.

#### API call
- `updateTrainingProgramStatus(programId)`

#### React concepts used
- `useState` for UI message (`uiMessage`, `uiError`)
- `useLocation` for route state
- `useNavigate` for redirects
- controlled button states (deactivation button disabled when not active)

#### Internal workflow
1. Read role + navigate + program from router state.
2. Role guard failure → navigate to `/login`.
3. If `!program`, show warning “No program data available.”
4. Derive `isActive = String(program.status).toUpperCase() === 'ACTIVE'`.
5. Deactivate handler `handleDeactivateProgram`:
   - confirm dialog; if cancelled → return
   - compute `programId` defensively:
     - program.programID ?? program.programId ?? program.id
   - if missing → show error message
   - call `updateTrainingProgramStatus(programId)`
   - on success:
     - show success message
     - navigate back to programs list
   - on failure:
     - set uiError true + uiMessage failure

#### Why “confirm” matters
Prevents accidental deactivation, but it’s still client-side protection only.

---

### 5.5 `ProgramEnrollments.jsx`
Location: `src/pages/programManager/ProgramEnrollments.jsx`

#### Purpose
Show enrollment table for the selected program and allow updating enrollment status.

#### Data input source
- from router state: `const program = state?.program;`

#### API calls
1. `getEnrollmentsByProgram(programId)` on load
2. `updateEnrollmentStatus(enrollmentId, status)` when user changes status

#### React concepts used
- `useEffect` load-on-mount
- `useState`:
  - `enrollments`
  - `loading`
  - `updatingId` (disables status dropdown only for the row being updated)
  - `error`
- `EnrollmentTable` as a presentation component
- “lifting state up” pattern:
  - table calls back `onStatusChange`
  - parent does API call + state update

#### Internal workflow (step order)
1. Read role and guard.
2. On mount:
   - compute `programId = program?.programID || program?.programId || program?.id`
   - if no programId → setEnrollments([]) and stop
   - else `getEnrollmentsByProgram(programId)`
   - setEnrollments(data)
3. Status change handler `changeEnrollmentStatus(enrollmentId, status)`:
   - setUpdatingId(enrollmentId)
   - call `updateEnrollmentStatus(enrollmentId, status)`
   - response is used to patch local state:
     - `setEnrollments(prev => prev.map(e => (id === updatedId ? updated : e)))`
   - finally setUpdatingId(null)

#### Minute detail: row identity
Each enrollment row can have different ID fields:
- parent compares:
  - `const id = e.enrollmentID || e.enrollmentId || e.id;
  `
- and matches the returned enrollment using the same defense:
  - `updated?.enrollmentID || updated?.enrollmentId || updated?.id`

---

### 5.6 `TrainingReports.jsx`
Location: `src/pages/programManager/TrainingReports.jsx`

#### Purpose
Display training report analytics and progress insights.

#### API call
- `getTrainingReport()`

#### React concepts used
- `useState` for `report`, `loading`, `error`
- `useEffect` to fetch on mount
- derived metrics computed during render (not via useMemo, but effectively derived)
- conditional rendering:
  - loading spinner vs report UI

#### Data workflow
1. role guard on mount
2. load:
   - setLoading(true)
   - `const data = await getTrainingReport()`
   - `setReport(data ?? {})`
3. derive metrics:
   - totalEnrollments
   - completedEnrollments
   - activeEnrollments
   - remainingEnrollments
4. compute completionPct:
   - if total > 0: completed/total * 100 and round
5. compute completionHealth category string:
   - >=80 Excellent
   - >=50 Moderate
   - else Needs Attention
6. UI shows cards + progress bar + insight bullets.

---

## 6) Program Manager components (in `src/pages/programManager/components/`)

### 6.1 `ProgramCard.jsx`
- Pure presentational card for a program
- Uses `StatusBadge`
- Renders buttons with callback props:
  - `onViewDetails`
  - `onViewEnrollments`

Concepts:
- Stateless component (no state)
- Uses props as single source of truth

---

### 6.2 `StatusBadge.jsx`
Maps status → bootstrap badge color.

- `ACTIVE` → primary
- `ENROLLED` → primary
- `COMPLETED` → success
- `CANCELLED` → danger
- default → secondary

Concept:
- normalization with `String(status).toUpperCase()`

---

### 6.3 `EnrollmentTable.jsx`
- Presentation component rendering enrollment rows

Props:
- `enrollments`
- `onStatusChange(id, newStatus)` callback
- `updatingId` to disable status selector for one row

Important logic:
- if enrollments array is empty → show a message
- for each enrollment:
  - `const id = e.enrollmentID || e.id;`
  - render `StatusBadge` for `e.status`
  - render `EnrollmentStatusSelector`

Concept:
- “render-only” table; side effects live in the parent.

---

### 6.4 `EnrollmentStatusSelector.jsx`
- Dropdown for changing enrollment status

Props:
- `value`
- `disabled`
- `onChange(s)`

It shows current status using `StatusBadge`.
It uses a local constant `OPTIONS = [ENROLLED, COMPLETED, CANCELLED]`.

Concept:
- controlled `<select>` with `value={value || 'PENDING'}`
  - note: PENDING isn’t in OPTIONS; that means PENDING shows visually but cannot be selected by dropdown options.

---

## 7) End-to-end workflows (what user does → what code does)

### Workflow A: Create a training program
1. User fills CreateTrainingProgram form
2. UI validates locally (`titleOk` + `datesOk`)
3. Submit → `handleSubmit` calls:
   - `createTrainingProgram(payload)`
4. Axios pipeline:
   - attaches token + baseURL
   - response is normalized
5. On success:
   - navigate to `/dashboard/program-manager/programs`
6. Programs list re-renders from API `getTrainingPrograms()`.

### Workflow B: Deactivate program
1. ProgramDetails screen loads program from route state
2. Click “Deactivate Program”
3. confirm dialog
4. Call `updateTrainingProgramStatus(programId)`
5. On success navigate back to Programs list.

### Workflow C: Update enrollment status
1. ProgramEnrollments screen loads enrollments using `getEnrollmentsByProgram(programId)`
2. User changes dropdown in a row
3. Row dropdown triggers `onStatusChange(id, status)`
4. Parent calls `updateEnrollmentStatus(id, status)`
5. Parent updates local `enrollments` immutably with `.map()`
6. Dropdown is disabled only for the updated row while request is in-flight (`updatingId`).

---

## 8) React concepts checklist (Program Manager specific)
To explain in interview, mention these clearly:

1. **Role-based access control (RBAC)**
   - `requireProgramManagerRole(role)`
   - redirect to `/login` on failure

2. **Load-on-mount with useEffect**
   - TrainingPrograms, ProgramEnrollments, TrainingReports, Dashboard all fetch data on mount

3. **Concurrent fetching with Promise.all**
   - Dashboard fetches programs + training report simultaneously

4. **Derived state computations**
   - Dashboard counts
   - TrainingReports completion metrics
   - CreateTrainingProgram validation

5. **Controlled components**
   - CreateTrainingProgram inputs
   - EnrollmentStatusSelector select

6. **Lifting state up**
   - EnrollmentTable is stateless and calls parent for side effects

7. **Optimistic UX during updates**
   - `updatingId` disables only the relevant row selector

8. **Defensive response normalization**
   - handle unknown backend field names (camelCase vs snake_case)

9. **Router state dependency**
   - ProgramDetails and ProgramEnrollments rely on `useLocation().state.program`

---

## 9) Program Manager files list
Top-level:
- `ProgramManagerDashboard.jsx`
- `TrainingPrograms.jsx`
- `TrainingReports.jsx`
- `CreateTrainingProgram.jsx`
- `ProgramDetails.jsx`
- `ProgramEnrollments.jsx`
- `roleGuard.js`

Components:
- `components/ProgramCard.jsx`
- `components/StatusBadge.jsx`
- `components/EnrollmentTable.jsx`
- `components/EnrollmentStatusSelector.jsx`

API + shared infrastructure:
- `src/api/programManagerApi.js`
- `src/api/axiosConfig.js`
- `src/utils/tokenStorage.js`

