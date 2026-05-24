# Frontend (src/) — Deep Explain (Non-pages): API/auth/config + core components + utils

This document explains everything under `src/` **except** the `src/pages/` folder, in a deep “interview explainer” style.

It covers:
- `src/App.jsx` routing and dashboard routing
- `src/index.jsx` bootstrapping
- `src/auth/ProtectedRoute.jsx`
- `src/api/*` infrastructure APIs
- `src/api/axiosConfig.js` request/response/error pipeline
- `src/utils/tokenStorage.js` auth persistence
- `src/utils/InterviewCache.js` interview caching
- `src/components/*` shared layout components

---

## 1) App entry & routing

### 1.1 `src/index.jsx` (React bootstrap)
**What it does:**
- creates the React root: `ReactDOM.createRoot(document.getElementById('root'))`
- renders `<App />` inside `React.StrictMode`

**Why StrictMode matters:**
- React intentionally double-invokes some lifecycle logic in development to surface side-effect bugs.
- If you rely on “only run once”, make sure effects are correctly dependency-scoped.

---

### 1.2 `src/App.jsx` (all routing)
This is the central router using `react-router-dom`.

#### Key imports
- `BrowserRouter`, `Routes`, `Route`, `Navigate`
- `ProtectedRoute` wrapper
- pages for each role and auth screens
- `getRole()` to determine dashboard routing

#### `AuthLayout` internal component
- purely UI layout for login/signup/reset/forgot screens
- **No side effects**, just renders branding + `children`

#### `DashboardRouter` internal component
**Purpose:** decide which dashboard component to show based on stored role:
- `JOB_SEEKER` → `JobSeekerDashboard`
- `EMPLOYER` → `EmployerDashboard`
- `ADMIN` → `AdminDashboard`
- `OFFICER` → `OfficerDashboard`
- `AUDITOR` → `AuditorDashboard`
- `PROGRAM_MANAGER` → `ProgramManagerDashboard`

If none match → redirect to `/login`.

#### Routes overview
1. Auth routes:
   - `/login`, `/forgot-password`, `/reset-password`, `/signup`
   - `/signup/jobseeker`, `/signup/employer`

2. Protected root:
   - `/dashboard`
     - element = `<ProtectedRoute><DashboardRouter/></ProtectedRoute>`

3. Protected role-specific URLs:
   - Program Manager: `/dashboard/program-manager/*`
   - Admin: `/dashboard/admin/*`
   - Officer: `/dashboard/officer/*`
   - Auditor: (only dashboard route imported)
   - Job Seeker: `/dashboard/jobseeker/*`
   - Employer: `/dashboard/employer/*`

4. Static pages:
   - `/about`, `/contact`

5. Fallback:
   - `/` and `*` redirect to `/login`

**Interview explanation detail:**
- Two layers of gating exist:
  1) `ProtectedRoute` ensures auth token exists
  2) individual pages also enforce RBAC using `getRole()` + `Navigate`

This double gating reduces “wrong role” access, even if routing is manipulated.

---

## 2) ProtectedRoute

### 2.1 `src/auth/ProtectedRoute.jsx`
**Logic:**
```js
if (!isAuthenticated()) return <Navigate to="/login" replace />;
return children;
```

- `isAuthenticated()` is from `src/utils/tokenStorage.js`.
- This is a simple auth presence check; it does not check role.

---

## 3) Shared API infrastructure

### 3.1 `src/api/axiosConfig.js`
This is the most critical shared infrastructure file.

#### 3.1.1 Create instance
- `axios.create({ timeout: 10000, headers: { 'Content-Type': 'application/json' } })`

#### 3.1.2 Request interceptor
For every request:
1. `config.baseURL = import.meta.env.VITE_BACKEND_URL`
2. Read token using `getToken()`
3. If token exists → attach:
   - `config.headers.Authorization = Bearer <token>`

This means:
- all `api/*.js` wrappers can call `axiosInstance.get('/x')` without manually setting baseURL or headers.

#### 3.1.3 Response interceptor
- If backend returns `{ data: { data: ... } }`-like shape, code tries:
  - `response.data?.data !== undefined ? response.data.data : response.data`

So caller gets the “payload” directly.

#### 3.1.4 Error interceptor
- `401`:
  - `clearAuthData()`
  - `window.location.href = '/login'`
  - rejects with `Session expired...`
- if `error.response.data.message` exists → rejects with that message
- otherwise rejects with a generic error

**Interview detail:**
- Because errors are normalized here, UI code’s `catch (e)` can consistently render `e.message`.

---

## 4) Auth/session utilities

### 4.1 `src/utils/tokenStorage.js`
Stores and reads from `localStorage`.

Keys used:
- `workforce_token` (JWT)
- `workforce_role`
- `workforce_username`
- `workforce_jobSeekerId`
- `workforce_employerId`

Exports (key ones):
- `saveAuthData(authResponse)`
  - writes token/role/username/IDs
- `getToken()`, `getRole()`, `getUsername()`, `getJobSeekerId()`, `getEmployerId()`
- `isAuthenticated()`
  - `return getToken() !== null`
- `clearAuthData()`
  - removes all keys

**Why this design:**
- Axios interceptor reads `getToken()`
- Role guards across pages read `getRole()`
- job seeker/employer specific pages read IDs

---

## 5) Interview caching utility

### 5.1 `src/utils/InterviewCache.js`
Purpose:
- store interview scheduling/results in localStorage so UI can update interview status later.

Key logic:
- KEY = `'interviews_map'`
- `getInterviewCache()`:
  - parses JSON
  - returns `{}` on parse failure

- `saveInterview(applicationID, interview)`:
  - `cache[applicationID] = interview`
  - writes JSON back

- `getInterviewByApplication(applicationID)`
  - returns cached interview or null

- `updateInterviewResult(applicationID, result)`
  - if entry exists:
    - sets `status='COMPLETED'`
    - sets `result`
    - writes back

**How it’s used in Employer UI:**
- when employer schedules interview from applications list, it stores interview identifiers keyed by application ID.
- later, the employer updates the result using that cached interviewID.

---

## 6) API modules besides pages
These files are primarily thin wrappers around `axiosInstance`.

### 6.1 `src/api/authApi.js`
Explains the auth endpoints:
- `signup(name, email, username, password, role)`
  - POST `/auth/signup`
  - returns `{ success: true, message: data }`

- `login(username, password)`
  - POST `/auth/login`
  - returns the raw login response (which likely includes token/role)

- `logout()`
  - POST `/auth/logout`

- `forgotPassword(email)`
  - POST `/auth/forgot-password`

- `resetPassword(username, token, newPassword)`
  - POST `/auth/reset-password`

**Why this matters:**
- the login response is consumed by `tokenStorage.saveAuthData()` (in some auth pages/components).

### 6.2 `src/api/notificationsApi.js`
(Not expanded here—because you requested non-pages, but if you want we can add endpoint-by-endpoint.)

### 6.3 Role-specific API modules
These are similar wrappers:
- `adminApi.js`
- `officerApi.js`
- `auditorApi.js`
- `programManagerApi.js`
- `employerApi.js`
- `jobSeekerApi.js`

All of them benefit from:
- `axiosConfig` interceptors
- token attachment
- response normalization
- 401 redirect/cleanup

---

## 7) Shared components (non-pages)

### 7.1 `src/components/AppLayout.jsx`
(You asked for non-pages; this is a shared layout used by role dashboards.)
Typical responsibilities:
- top navigation/header
- consistent page spacing
- footer

If you want, I can read and provide line-by-line for each component under `src/components`.

---

### 7.2 `DashboardHeader.jsx`, `DashboardFooter.jsx`, `NotificationsDropdown.jsx`
Used across role dashboards.

They typically:
- render consistent dashboard chrome
- show notifications dropdown

---

## 8) What to emphasize in an interview
When describing these non-pages files:
1. `index.jsx` boots React
2. `App.jsx` defines routing tree + ProtectedRoute gating
3. `ProtectedRoute` checks auth token existence
4. `axiosConfig.js` is the request pipeline: baseURL, auth header, response normalization, error normalization
5. `tokenStorage.js` is the persistence layer for token/role/IDs
6. `InterviewCache.js` explains why localStorage is used for cross-step interview result updates

---

## 9) Next step (if you want maximal detail)
If you want the “minute details” level for every shared component file too, I will read:
- `src/components/AppLayout.jsx`
- `src/components/DashboardHeader.jsx`
- `src/components/DashboardFooter.jsx`
- `src/components/NotificationsDropdown.jsx`
- and also API files `notificationsApi.js` + others.

