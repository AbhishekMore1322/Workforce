# Employer Module — Deep Explain (API Flow + React Concepts + Data Workflow)

This document explains the **Employer** frontend in the same “interviewer-friendly” way as your Officer/Auditor/Program Manager explainers.
It covers:
- role-based access control
- tokenStorage + axiosConfig internal flow
- every Employer API call and what UI triggers it
- every file in `src/pages/employer/` and `src/pages/employer/components/`
- React concepts used (useEffect/useState/useMemo/controlled forms/modals/router params)
- how data flows end-to-end (user actions → API calls → state updates)

---

## 1) Big Picture: Employer role workflow
Employer screens implement hiring pipeline management:
1. View posted **Job Listings**
2. View **Job Applications** for a job
   - Approve/Reject applications
   - Add officer-style notes (employer notes)
   - View resume (latest)
   - Schedule interview
   - Update interview result (and trigger placement creation)
3. View **Placements** (confirmed outcomes)
4. Manage **Employer Profile**
   - edit company profile
5. Manage jobs
   - create/edit jobs
6. View **Interviews** and update results, create placements

Key structure:
- Pages: `src/pages/employer/*.jsx`
- Components: `src/pages/employer/components/*`
- API: `src/api/employerApi.js`
- Shared networking/auth: `src/api/axiosConfig.js`, `src/utils/tokenStorage.js`

---

## 2) Auth + Axios internal flow (shared by all Employer API calls)

### 2.1 tokenStorage
Employer role checks use:
- `getRole()` from `src/utils/tokenStorage.js`
- token is stored in `localStorage` under `workforce_token`

### 2.2 axiosConfig interceptors
**File:** `src/api/axiosConfig.js`
Every Employer API call uses `axiosInstance`, so the full pipeline is:

1. Request interceptor:
   - sets `baseURL = import.meta.env.VITE_BACKEND_URL`
   - attaches `Authorization: Bearer <token>` if token exists

2. Response interceptor:
   - normalizes payload to `response.data.data` when available
   - otherwise returns `response.data`

3. Error interceptor:
   - 401 → clear auth + redirect to `/login`
   - message extraction for user-friendly error

**Implication for components:**
UI code can safely do `await apiCall()` and then handle result via normal `try/catch`, because axios normalizes shape.

---

## 3) Employer API layer — `src/api/employerApi.js`
This file contains the endpoints Employer UI calls.

Below each function: **Endpoint** → **Used by** → **What it does**

### 3.1 Employer registration + profile
1. `registerEmployer(data)`
   - POST `/employers/register`
   - used by signup flow (`SignupEmployer.jsx` not explained here)
   - validates inputs before calling API

2. `getEmployerProfile(employerId)`
   - GET `/employers/${employerId}`
   - used by: `EmployerProfile.jsx`, `EditEmployerProfile.jsx`

3. `updateEmployerProfile(employerId, payload)`
   - PUT `/employers/${employerId}`
   - used by: `EditEmployerProfile.jsx`

4. `deleteEmployerAccount(employerId)`
   - DELETE `/employers/${employerId}`
   - may be used by account deletion UI (not shown in reviewed pages)

---

### 3.2 Job posting management
5. `createJobPosting(payload)`
   - POST `/jobs`
   - used by: `CreateJob.jsx`

6. `getJobPostingById(jobId)`
   - GET `/jobs/${jobId}`
   - used by: `EditJob.jsx` (load existing job)

7. `updateJobPosting(jobId, payload)`
   - PUT `/jobs/${jobId}`
   - used by: `EditJob.jsx`

8. `updateJobStatus(jobId, status)`
   - PATCH `/jobs/${jobId}/status?status=${status}` (query param)
   - used by: `JobListings.jsx` to close job (status = CLOSED)

9. `deleteJobPosting(jobId)`
   - DELETE `/jobs/${jobId}`
   - not shown in reviewed code, but available

10. `getAllJobPostings()`
   - GET `/jobs`
   - used by: `EmployerDashboard.jsx` and `JobListings.jsx`

---

### 3.3 Applications + notes + interview scheduling
11. `getApplicationsByJob(jobId)`
   - GET `/applications/job/${jobId}`
   - used by: `JobApplications.jsx` to load apps for a job

12. `updateApplicationStatus(applicationId, status)`
   - PATCH `/applications/${applicationId}/status?status=${status}`
   - used by: `JobApplications.jsx`
   - approve: status=APPROVED
   - reject: status=REJECTED

13. `addApplicationNote(applicationId, notes)`
   - POST `/applications/${applicationId}/notes` with `{ notes }`
   - used by: `JobApplications.jsx`
   - opens notes modal and saves

14. `scheduleInterview(payload)`
   - POST `/interviews/schedule`
   - used by: `JobApplications.jsx`

15. `updateInterviewStatus(interviewId, payload)`
   - PATCH `/interviews/${interviewId}/status` with `payload`
   - used by:
     - `JobApplications.jsx` to set COMPLETED + result
     - `EmployerInterviews.jsx` to set COMPLETED + result

16. `getEmployerInterviews()`
   - GET `/interviews/employer/me`
   - used by: `EmployerInterviews.jsx`

17. `getLatestResume(jobSeekerId)`
   - GET `/jobseekers/${jobSeekerId}/documents/resume/latest`
   - used by: `JobApplications.jsx`
   - open resume modal

---

### 3.4 Placements
18. `createPlacement(payload)`
   - POST `/placements/create`
   - used by: `EmployerInterviews.jsx` after shortlist + result
   - also exists in `employerApi.js`

19. `getAllPlacements()`
   - GET `/placements`
   - used by: `Placements.jsx` and employer dashboard stats

---

## 4) Employer pages: file-by-file deep explain

### 4.1 `EmployerDashboard.jsx`
Purpose:
- show dashboard stats for the employer (jobs count, apps count, scheduled interviews, successful placements)

API calls:
- `getAllJobPostings()`
- `getApplicationsByJob(jobId)` for each job (sequential loop)
- `getEmployerInterviews()`
- `getAllPlacements()`

React concepts:
- `useState` for `stats`
- `useEffect` to load stats once
- role-based access via `if (role !== 'EMPLOYER') return <Navigate ...>`

Minute workflow:
1. Read employerId from `localStorage.getItem('workforce_employerId')`
2. Load all jobs then filter to only jobs that match `job.employerID == employerId`.
3. `activeJobs` = number with `status === 'OPEN'`.
4. Applications stats:
   - uses a `for...of` loop (sequential calls) to match backend.
   - totals applications across jobs
   - totals count of apps where `status === 'SHORTLISTED'`
5. Interview stats:
   - fetch employer interviews list
   - `scheduledInterviews` count where `status === 'SCHEDULED'`
6. Placements stats:
   - fetch placements
   - filter by `placement.employerID`
   - `successfulPlacements = myPlacements.length`

Why sequential instead of Promise.all?
- comment says to preserve existing backend behavior.

---

### 4.2 `JobListings.jsx`
Purpose:
- list job postings belonging to this employer
- allow closing a job

API calls:
- `getAllJobPostings()`
- `updateJobStatus(jobId, 'CLOSED')`

React concepts:
- `useEffect` with dependency `[role]`
- `useState` for jobs/loading/error
- `Navigate` redirect on wrong role
- optimistic UX pattern: after closing job, it refetches

Minute workflow:
1. `role` check at render time
2. `loadJobs()`
   - read employerId from `localStorage`
   - throw error if missing
   - `getAllJobPostings()` then filter to employer-owned jobs
3. Render:
   - loading → EmptyState spinner
   - empty → EmptyState no jobs
   - else → map `jobs` into `JobCard`
4. `handleCloseJob(job)`
   - confirm
   - call patch status
   - then `loadJobs()`

---

### 4.3 `JobApplications.jsx`
This is the most complex file.

Purpose:
- manage applications for a specific job
- handle approve/reject, notes, resume viewing, interview scheduling, interview result updating

Route + props:
- uses `useParams()` to read `jobId` from URL

API calls:
- `getApplicationsByJob(jobId)`
- `updateApplicationStatus(applicationID, status)`
- `addApplicationNote(applicationID, notes)`
- `scheduleInterview({ applicationID, employerID, date, time })`
- `updateInterviewStatus(interviewId, { status, result })`
- `getLatestResume(jobSeekerId)`

React concepts:
- Many `useState` flags for modals:
  - `showNote`, `showInterview`, `showResult`, `showResume`
- caching interview data:
  - uses localStorage map with key `interviews_map`
  - helper functions: `getInterviewMap`, `setInterviewCache`
- `useEffect` load applications whenever `jobId` changes

Minute workflow (end-to-end):
1. Role check: if not EMPLOYER → redirect
2. `useEffect(loadApplications)`
   - `const data = await getApplicationsByJob(jobId)`
   - setApplications(array)
3. Approve/Reject:
   - `approve(id)` → PATCH application status then reload list
   - `reject(id)` → PATCH then reload
4. Notes modal:
   - click Add Note → setSelectedApp(app), `setShowNote(true)`
   - `submitNote(notes)` calls `addApplicationNote(selectedApp.applicationID, notes)`
5. Resume modal:
   - click View Resume → `viewLatestResume(application)`
   - extracts `jobSeekerId = application.seekerID`
   - calls `getLatestResume(jobSeekerId)`
   - sets `resumeUrl` and opens modal
6. Schedule interview:
   - modal returns `{ date, time }`
   - calls `scheduleInterview({ applicationID, employerID, date, time })`
   - caches interview response into localStorage map so later result update knows interviewID
7. Update interview result:
   - modal returns `result`
   - reads cached interview by applicationID
   - calls `updateInterviewStatus(interviewID, { status:'COMPLETED', result })`
   - updates cache to mark status COMPLETED

Why interview cache exists?
- scheduling returns interview identifiers needed later for updating result.
- modal open/close cycles + re-renders can lose that ID.
- localStorage makes it persistent across UI transitions.

---

### 4.4 `Placements.jsx`
Purpose:
- show confirmed placement cards for the employer

API calls:
- `getAllPlacements()`

React concepts:
- `useEffect` load when role is EMPLOYER
- filtering data locally:
  - `myPlacements = placements.filter(p.employerID == workforce_employerId)`

Rendering:
- loading → EmptyState
- none → EmptyState
- else → map `PlacementCard`

---

### 4.5 `EmployerInterviews.jsx`
Purpose:
- manage scheduled/completed interviews list for the employer
- update result from modal
- create placement when shortlisted

API calls:
- `getEmployerInterviews()` (load + refresh)
- `updateInterviewStatus(interviewId, { status:'COMPLETED', result })`
- `createPlacement({ applicationID, employerID, position, startDate })`

React concepts:
- `useEffect` refresh list once on mount
- computed inline lists (no useMemo):
  - `scheduled = interviews.filter(i.status === 'SCHEDULED')`
  - `completed = interviews.filter(i.status === 'COMPLETED')`
- conditional rendering inside self-invoking function

Minute workflow:
1. `refreshInterviews()`
   - fetch list
   - normalize `interviewID` and numeric `applicationID`
2. When click “Update Interview Result”
   - setSelected(interview) and show modal
3. `updateResult(result)`
   - calls `updateInterviewStatus(interviewId, {status:'COMPLETED', result})`
   - hides modal, clears selected, refreshes
4. `createPlacementForInterview(interview)`
   - only shown when completed AND result === 'SHORTLISTED'
   - creates placement and refreshes

---

### 4.6 Profile + Job management pages
#### `EmployerProfile.jsx`
- fetches employer profile using `getEmployerProfile(employerId)`
- reads `employerId` from localStorage
- render states:
  - loading → EmptyState
  - no profile → EmptyState
  - else → show profile card

#### `EditEmployerProfile.jsx`
- loads profile in `useEffect`, populates controlled form state
- submit → `updateEmployerProfile(employerId, payload)`

#### `CreateJob.jsx`
- controlled job form; payload:
  - employerID: Number(localStorage workforce_employerId)
  - requirementsJSON: JSON.stringify(skills.split(',').map(trim))

#### `EditJob.jsx`
- reads `jobId` from router params
- load job with `getJobPostingById(jobId)`
- parse `requirementsJSON` to string list for form
- submit → `updateJobPosting(jobId, payload)`

---

## 5) Employer components: file-by-file explanation

### 5.1 `components/ApplicationCard.jsx`
Purpose:
- show one application summary and show action buttons based on application status and interview status.

Logic:
- uses enum `ApplicationStatus` from `employerEnums.js`
- if `status === SUBMITTED` show:
  - Approve, Reject, View Resume, Add Note
- if `status === APPROVED && !interview` show:
  - Schedule Interview
- if `interview?.status === 'SCHEDULED'` show info badge
- if `interview?.status === 'COMPLETED'` show:
  - Update Interview Result

Concepts:
- pure component
- conditional rendering driven by props

---

### 5.2 `components/ApplicationNoteModal.jsx`
Purpose:
- modal UI for employer notes.

Key behaviors:
- maintains local `notes` state
- `useEffect([open])`:
  - when opened: clear notes + `document.body.style.overflow='hidden'` (prevents background scroll)
  - when closed/unmounted: restore overflow
- validation:
  - `MIN_LENGTH=5`, `MAX_LENGTH=500`
  - `isInvalid` computed every render
- Save button disabled if invalid

Controlled actions:
- Save button calls `onSave(notes.trim())`

Concepts:
- modal lifecycle with `open`
- controlled textarea + derived validation

---

### 5.3 Other modals (high-level)
(These files follow the same pattern: modal open/close via boolean prop, controlled form fields, call parent callbacks on save.)

- `InterviewScheduleModal.jsx`
- `InterviewResultModal.jsx`
- `ViewResumeModal.jsx`
- `InterviewResultModal` likely calls parent `onSave(result)` and shows loading/error.

---

## 6) End-to-end data workflows (Employer)

### Workflow A: Employer loads job applications for a job
1. Navigate to `/dashboard/employer/jobs/:jobId/applications`
2. `JobApplications.jsx` reads `jobId` from `useParams()`
3. `useEffect` calls `getApplicationsByJob(jobId)`
4. Sets `applications` state
5. UI maps each application into `ApplicationCard` with action callbacks

### Workflow B: Approve → schedule interview
1. In `ApplicationCard`, status SUBMITTED → click Approve
2. Parent `approve(id)` calls `updateApplicationStatus(id,'APPROVED')`
3. Reload apps list
4. Now `ApplicationCard` shows Schedule Interview button (status APPROVED and no interview)
5. Scheduling calls `scheduleInterview(payload)`
6. Parent caches interview identifiers in localStorage for later result update

### Workflow C: View resume
1. Click View Resume
2. Parent calls `getLatestResume(seekerID)`
3. Opens `ViewResumeModal` with `resumeUrl`

---

## 7) React concepts checklist (Employer-specific)
To answer interview questions clearly, mention:

1. **Role-based protection per page** using `getRole()` + `Navigate`
2. **Route params** with `useParams()` for job-scoped data
3. **Complex modal state management** (multiple boolean flags)
4. **Controlled inputs** in profile/job forms and modals
5. **Async side effects with useEffect**
6. **Local storage cache for cross-step data** (`interviews_map`)
7. **Defensive ID extraction & normalization**
8. **Presentational vs container split**
   - `JobApplications.jsx` holds state + side effects
   - `ApplicationCard` is mostly render-only

---

## 8) Employer files list
Pages:
- `src/pages/employer/EmployerDashboard.jsx`
- `src/pages/employer/JobListings.jsx`
- `src/pages/employer/JobApplications.jsx`
- `src/pages/employer/Placements.jsx`
- `src/pages/employer/EmployerInterviews.jsx`
- `src/pages/employer/EmployerProfile.jsx`
- `src/pages/employer/EditEmployerProfile.jsx`
- `src/pages/employer/CreateJob.jsx`
- `src/pages/employer/EditJob.jsx`

Components:
- `src/pages/employer/components/ApplicationCard.jsx`
- `src/pages/employer/components/ApplicationNoteModal.jsx`
- `src/pages/employer/components/InterviewScheduleModal.jsx`
- `src/pages/employer/components/InterviewResultModal.jsx`
- `src/pages/employer/components/ViewResumeModal.jsx`
- `src/pages/employer/components/PlacementCard.jsx`
- `src/pages/employer/components/JobCard.jsx`
- plus shared small UI components (StatusBadge, EmptyState, etc.)

API + shared infrastructure:
- `src/api/employerApi.js`
- `src/api/axiosConfig.js`
- `src/utils/tokenStorage.js`

