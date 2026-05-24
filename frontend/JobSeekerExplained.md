# Job Seeker Module — Deep Explain (API Flow + React Concepts + Data Workflow)

This document explains the **Job Seeker** frontend in the same interview-friendly depth as the Officer/Auditor/Program Manager/Employer explainers.

It covers:
- role-based access and auth checks
- tokenStorage + axiosConfig internal request pipeline
- every API call in `src/api/jobSeekerApi.js`
- every file in `src/pages/jobseeker/`
- key components inside `src/pages/jobseeker/components/`
- React concepts used (useEffect/useState/useMemo/controlled forms/router params)
- end-to-end workflows (browse → apply → track applications → enroll → upload documents)

---

## 1) Big Picture: Job Seeker workflow
A job seeker experience implemented in your UI typically looks like:
1. Complete profile (basic info + skills)
2. Upload required documents (resume at least)
3. Browse training programs and enroll
4. Browse jobs and apply
5. Track outcomes in “My Applications”
6. Manage documents (view/delete)

Your Job Seeker pages live under:
- `src/pages/jobseeker/*`

API layer lives under:
- `src/api/jobSeekerApi.js`

Networking/auth infrastructure is shared:
- `src/api/axiosConfig.js`
- `src/utils/tokenStorage.js`

---

## 2) Shared auth + Axios: how every Job Seeker API call works internally

### 2.1 tokenStorage (who you are)
Job seeker pages use:
- `getRole()` to ensure role is `JOB_SEEKER`
- `getJobSeekerId()` to call APIs that require the current seeker identity
- `getUsername()` for friendly UI greeting

(Implementation is in `src/utils/tokenStorage.js`.)

### 2.2 axiosConfig (how requests reach backend)
Job seeker API functions call `axiosInstance` configured in:
- `src/api/axiosConfig.js`

Internal pipeline for any request:
1. **Request interceptor**
   - sets `config.baseURL = import.meta.env.VITE_BACKEND_URL`
   - reads token via `getToken()`
   - attaches `Authorization: Bearer <token>`

2. **Response interceptor**
   - if backend returns `{ data: <payload> }`, it returns `<payload>`
   - else it returns `response.data` directly

3. **Error interceptor**
   - if `401`: clears auth and redirects to `/login`
   - if backend message exists: rejects with `new Error(message)`

**Consequence for UI:** components can `try/catch` and show `e.message` without caring about response nesting.

---

## 3) Job Seeker API layer — `src/api/jobSeekerApi.js`
This file provides endpoint wrappers. Each wrapper uses `axiosInstance`.

Below: **Function** → **Endpoint** → **Used by** → **What it does**

### 3.1 Registration + profile
1. `registerJobSeeker(data)`
   - POST `/jobseekers/register`
   - validates required fields before calling API

2. `getMyProfile()`
   - GET `/jobseekers/${jobSeekerId}`
   - uses `getJobSeekerId()` from tokenStorage
   - used by: JobSeekerDashboard, JobSeekerProfile

3. `updateMyProfile(payload)`
   - PUT `/jobseekers/${jobSeekerId}`

4. `deleteJobSeekerProfile()`
   - DELETE `/jobseekers/${jobSeekerId}`

5. `updateMySkills(skillsJSON)`
   - PATCH `/jobseekers/${jobSeekerId}/skills` with `{ skillsJSON }`

---

### 3.2 Training programs
6. `getActiveTrainingPrograms()`
   - GET `/training-programs`
   - then filters in the frontend by `status === 'ACTIVE'`

7. `getAllTrainingPrograms()`
   - GET `/training-programs`

8. `getTrainingProgramById(programId)`
   - GET `/training-programs/${programId}`

9. `enrollInTrainingProgram(programId)`
   - POST `/training-programs/${programId}/enroll` with `{ seekerID }`
   - `seekerID` comes from tokenStorage

10. `getMyEnrollments()`
   - GET `/enrollments/jobseeker/${jobSeekerId}`

---

### 3.3 Documents
11. `getMyDocuments()`
   - GET `/jobseekers/${jobSeekerId}/documents`

12. `deleteDocument(docId)`
   - DELETE `/jobseekers/${jobSeekerId}/documents/${docId}`

13. `uploadJobSeekerDocumentLinkBased({ docType, fileURI })`
   - POST `/jobseekers/${jobSeekerId}/documents` with `{ docType, fileURI }`

---

### 3.4 Jobs + applications
14. `getMyApplications()`
   - GET `/applications/jobseeker/${jobSeekerId}`

15. `getAllJobPostings()`
   - GET `/jobs`

16. `searchJobPostings(keyword)`
   - if empty keyword → GET `/jobs`
   - else GET `/jobs/search?keyword=<keyword>`

17. `getJobPostingById(jobId)`
   - GET `/jobs/${jobId}`

18. `applyToJob(jobId)`
   - POST `/applications/apply` with `{ seekerID, jobID }`

19. `getApplicationsByJobAndSeeker(jobId)`
   - GET `/applications/job/${jobId}`
   - then filters returned applications by `jobSeekerId`

---

## 4) Job Seeker pages — file-by-file explanation

### 4.1 `JobSeekerDashboard.jsx`
Location: `src/pages/jobseeker/JobSeekerDashboard.jsx`

Role guard:
- `if (role !== 'JOB_SEEKER') return <Navigate to="/login" replace />;`

Key states:
- `loading`
- `profile`, `documents`, `enrollments`, `applications`
- `jobs` browsing panel state
  - `jobsLoading`, `showJobs`, `jobBoardMsg`, `jobSearch`, `jobActionLoadingId`
- `showResumePopup` for “resume required to apply” logic

API calls (concurrently):
- `getMyProfile()`
- `getMyDocuments()`
- `getMyEnrollments()`
- `getMyApplications()`
- (jobs search later via UI): `getAllJobPostings()` / `searchJobPostings()`

React concepts used (deep interview points):
- `Promise.allSettled([...])`
  - Instead of failing everything when one call fails, each result is stored independently.
  - That’s why the dashboard can partially render.
- `useMemo(profileCompletion)`
  - computes a completion percentage from profile fields
- `useMemo(appliedJobIdSet)`
  - builds a `Set` of job IDs for fast membership checks
- Controlled search input:
  - `value={jobSearch}` + `onChange`
- Conditional rendering:
  - loading state returns early
  - documents/resume popup shown only when required

End-to-end workflow inside dashboard:
1. On mount: fetch profile/documents/enrollments/applications.
2. User searches jobs → `loadJobs()` calls either:
   - `searchJobPostings(keyword)` or `getAllJobPostings()`
3. When user clicks Apply:
   - if no resume in documents (`hasResume`): open popup and stop
   - else:
     - validate job details with `getJobPostingById(id)`
     - call `applyToJob(id)`
     - message tells user to check “My Applications”

Minute detail: `hasResume` derivation
- It checks `documents.some(d => docType === 'RESUME')`.
- This ensures resume existence without needing a separate API call.

---

### 4.2 `JobSeekerDocuments.jsx`
Location: `src/pages/jobseeker/JobSeekerDocuments.jsx`

Purpose:
- list job seeker documents
- allow deleting documents

Role guard:
- `if (role !== 'JOB_SEEKER') redirect`.

States:
- `loading`, `documents`, `error`, `deletingId`

API calls:
- On mount: `getMyDocuments()`
- Delete button: `deleteDocument(docId)`

React concepts:
- `useEffect` load-on-mount
- `deletingId` enables per-card spinner/disable pattern
- After successful delete:
  - updates local list immutably with `filter()`

---

### 4.3 `JobSeekerProfile.jsx`
Location: `src/pages/jobseeker/JobSeekerProfile.jsx`

Purpose:
- read-only view of profile
- show progress (profileCompletion %)
- allow deactivate account

Key concepts:
- It calls `getMyProfile()` on mount.
- It parses `skillsJSON` carefully:
  - can be array
  - can be string JSON
  - can be comma-separated string
  - can be object

Deactivate workflow:
- `deleteJobSeekerProfile()` then `clearAuthData()` then navigate to `/login`

React concepts:
- `useMemo(skills)` style derived computations
- conditional modal rendering: `{showDeactivateModal && (...)}

---

### 4.4 `MyApplications.jsx`
Location: `src/pages/jobseeker/MyApplications.jsx`

Purpose:
- show list of job applications for this job seeker

API calls:
- `getMyApplications()` on mount

States:
- `loading`, `applications`, `error`

React concepts:
- derived badge color from `status` using string includes
- conditional rendering: loading vs empty vs table

---

## 5) Job Seeker folder components (what they do)
(You didn’t ask for every component file line-by-line in the partial reads, but the folder is structured similarly to Employer/Officer.)

Typical patterns in `src/pages/jobseeker/components/`:
- `JobSeekerLayout.jsx`: wrapper layout
- cards like `DocumentCard`, `JobPostingCard`, etc.
- stateless presentation components

If you want the full “component-by-component minute detail” (like ApplicationCard/Interview modals), tell me and I’ll expand this section by reading each component file.

---

## 6) End-to-end workflows (Job Seeker)

### Workflow A: Load dashboard
1. Visit `/dashboard/jobseeker`
2. `JobSeekerDashboard` runs `Promise.allSettled` for:
   - profile
   - documents
   - enrollments
   - my applications
3. UI uses `useMemo` to compute:
   - profile completion %
   - number of active applications

### Workflow B: Apply to a job
1. User searches and sees jobs
2. User clicks Apply
3. UI checks `hasResume`
4. If resume missing → popup instructs to upload resume
5. If resume exists:
   - calls `getJobPostingById(id)`
   - calls `applyToJob(id)`
6. User later checks results in `MyApplications.jsx`

### Workflow C: Delete a document
1. Documents page loads via `getMyDocuments()`
2. Delete button calls `deleteDocument(docId)`
3. UI removes it from local state via `filter()`

---

## 7) React concepts checklist (Job Seeker)
- RBAC via `getRole()` + `<Navigate />`
- Parallel fetching with `Promise.allSettled`
- Derived data with `useMemo` (`profileCompletion`, `appliedJobIdSet`, `hasResume`)
- Conditional rendering (loading/empty/popup)
- Controlled inputs (`jobSearch`)
- Immutable local updates after delete/apply

---

## 8) Job Seeker files list (top-level)
- `src/pages/jobseeker/JobSeekerDashboard.jsx`
- `src/pages/jobseeker/JobSeekerDocuments.jsx`
- `src/pages/jobseeker/JobSeekerProfile.jsx`
- `src/pages/jobseeker/MyApplications.jsx`
- plus other files in the folder (Edit profile, UploadDocument, TrainingPrograms, etc.)

---

If you want this to be as strict as your Officer/Auditor explainers (reading *every* JobSeeker page + every component file line-by-line), I can extend this document by iterating through the remaining `src/pages/jobseeker/*` and `src/pages/jobseeker/components/*` files.
