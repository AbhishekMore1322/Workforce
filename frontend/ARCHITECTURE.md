# WorkForce Frontend - Complete Architecture Overview

## 📊 Project Structure Diagram

```
frontend/
│
├── src/
│   ├── App.jsx                          ← Root component (routing hub)
│   ├── index.jsx                        ← React entry point
│   ├── App.css                          ← Global styles
│   │
│   ├── api/                             ← Network Layer
│   │   ├── axiosConfig.js               ← HTTP client with interceptors
│   │   ├── authApi.js                   ← Auth endpoints
│   │   ├── jobSeekerApi.js              ← Job seeker endpoints
│   │   ├── employerApi.js               ← Employer endpoints
│   │   ├── adminApi.js                  ← Admin endpoints
│   │   ├── officerApi.js                ← Officer endpoints
│   │   ├── auditorApi.js                ← Auditor endpoints
│   │   ├── programManagerApi.js         ← Program manager endpoints
│   │   └── notificationsApi.js          ← Notifications endpoints
│   │
│   ├── auth/                            ← Authentication
│   │   └── ProtectedRoute.jsx           ← Route guard component
│   │
│   ├── utils/                           ← Utilities
│   │   ├── tokenStorage.js              ← localStorage auth management
│   │   └── InterviewCache.js            ← Interview caching
│   │
│   ├── components/                      ← Shared/Reusable Components
│   │   ├── AppLayout.jsx                ← Main dashboard layout wrapper
│   │   ├── DashboardHeader.jsx          ← Header with user info
│   │   ├── DashboardFooter.jsx          ← Footer
│   │   ├── NotificationsDropdown.jsx    ← Notifications UI
│   │   └── AppLayout.css                ← Layout styles
│   │
│   └── pages/                           ← Page Components (Role-based)
│       │
│       ├── AboutUs.jsx
│       ├── ContactUs.jsx
│       │
│       ├── auth/                        ← Authentication Pages
│       │   ├── Login.jsx
│       │   ├── ForgotPassword.jsx
│       │   └── ResetPassword.jsx
│       │
│       ├── signup/                      ← Signup Pages
│       │   ├── SignupChoice.jsx
│       │   ├── SignupJobSeeker.jsx
│       │   └── SignupEmployer.jsx
│       │
│       ├── jobseeker/                   ← Job Seeker Dashboard
│       │   ├── JobSeekerDashboard.jsx
│       │   ├── JobSeekerProfile.jsx
│       │   ├── EditJobSeekerProfile.jsx
│       │   ├── JobSeekerDocuments.jsx
│       │   ├── UploadDocument.jsx
│       │   ├── TrainingPrograms.jsx
│       │   ├── MyEnrollments.jsx
│       │   ├── MyApplications.jsx
│       │   ├── jobseeker-ui.css
│       │   └── components/
│       │       ├── DashboardStatCard.jsx
│       │       ├── JobPostingCard.jsx
│       │       └── JobSeekerLayout.jsx
│       │
│       ├── employer/                    ← Employer Dashboard
│       │   ├── EmployerDashboard.jsx
│       │   ├── EmployerProfile.jsx
│       │   ├── EditEmployerProfile.jsx
│       │   ├── JobListings.jsx
│       │   ├── CreateJob.jsx
│       │   ├── EditJob.jsx
│       │   ├── JobApplications.jsx
│       │   ├── Placements.jsx
│       │   ├── EmployerInterviews.jsx
│       │   ├── employerEnums.js
│       │   └── components/
│       │       ├── ApplicationCard.jsx
│       │       ├── ApplicationNoteModal.jsx
│       │       └── [other components]
│       │
│       ├── admin/                       ← Admin Dashboard
│       │   ├── AdminDashboard.jsx
│       │   ├── AdminEmployers.jsx
│       │   ├── AdminJobSeekers.jsx
│       │   ├── AdminPlacements.jsx
│       │   ├── AdminPrograms.jsx
│       │   ├── AdminReports.jsx
│       │   ├── AdminShell.jsx
│       │   └── components/
│       │       ├── AdminStatsCards.jsx
│       │       ├── AdminTable.jsx
│       │       └── StatusBadge.jsx
│       │
│       ├── officer/                     ← Officer Dashboard
│       │   ├── OfficerDashboard.jsx
│       │   ├── OfficerApplications.jsx
│       │   ├── OfficerCompliance.jsx
│       │   ├── OfficerComplianceCheckModal.jsx
│       │   ├── OfficerComplianceReports.jsx
│       │   ├── OfficerEmployers.jsx
│       │   ├── OfficerJobSeekers.jsx
│       │   ├── OfficerPlacements.jsx
│       │   ├── OfficerTrainingPrograms.jsx
│       │   ├── OfficerDashboardRouteFix.jsx
│       │   └── OfficerEmployerComplianceModalState.js
│       │
│       ├── auditor/                     ← Auditor Dashboard
│       │   ├── AuditorDashboard.jsx
│       │   ├── auditorDashboard.css
│       │   └── components/
│       │       ├── AuditCard.jsx
│       │       ├── AuditList.jsx
│       │       ├── CreateAuditModal.jsx
│       │       ├── EmptyState.jsx
│       │       ├── ReportCard.jsx
│       │       └── ReportsOverview.jsx
│       │
│       └── programManager/              ← Program Manager Dashboard
│           ├── ProgramManagerDashboard.jsx
│           ├── TrainingPrograms.jsx
│           ├── CreateTrainingProgram.jsx
│           ├── ProgramDetails.jsx
│           ├── ProgramEnrollments.jsx
│           ├── TrainingReports.jsx
│           ├── roleGuard.js
│           └── components/
│
├── public/
│   ├── manifest.json
│   ├── robots.txt
│   └── logo.jpg
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🏗️ Architecture Layers

### Layer 1: Entry Point
```
index.jsx
   ↓
App.jsx (BrowserRouter wraps everything)
```

### Layer 2: Routing & Navigation
```
App.jsx
├── Auth Routes (public)
│   ├── /login
│   ├── /forgot-password
│   ├── /reset-password
│   ├── /signup
│   └── /signup/[jobseeker|employer]
│
├── Dashboard Routes (protected)
│   └── /dashboard (DashboardRouter determines role-based view)
│       ├── JobSeekerDashboard (role === 'JOB_SEEKER')
│       ├── EmployerDashboard (role === 'EMPLOYER')
│       ├── AdminDashboard (role === 'ADMIN')
│       ├── OfficerDashboard (role === 'OFFICER')
│       ├── AuditorDashboard (role === 'AUDITOR')
│       └── ProgramManagerDashboard (role === 'PROGRAM_MANAGER')
│
└── Static Routes (public)
    ├── /about-us
    └── /contact-us
```

### Layer 3: Authentication & Authorization

```
┌─────────────────────────────────────────────────────┐
│                   ProtectedRoute                    │
│  (Checks: isAuthenticated() from tokenStorage.js)  │
└────────────────┬────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
   ✅ Authenticated   ❌ Not Authenticated
        │                 │
        ▼                 ▼
   Render children    Navigate to /login
```

**Flow:**
1. User logs in via `/login`
2. `Login.jsx` calls `authApi.login(username, password)`
3. Backend returns JWT token + user metadata
4. `tokenStorage.js` saves to localStorage:
   - `workforce_token` (JWT)
   - `workforce_role` (JOB_SEEKER, EMPLOYER, etc.)
   - `workforce_username`
   - `workforce_jobSeekerId` or `workforce_employerId`
5. User redirects to `/dashboard`
6. `ProtectedRoute` validates `isAuthenticated()`
7. `DashboardRouter` reads `getRole()` and renders appropriate dashboard

### Layer 4: Data Flow Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    React Component                            │
│  (useState, useEffect, event handlers)                        │
└────────────┬──────────────────────────────────────────────────┘
             │
             │ API call (e.g., getMyApplications())
             │
             ▼
┌──────────────────────────────────────────────────────────────┐
│              API Layer (jobSeekerApi.js)                      │
│  - Input validation                                           │
│  - Call axiosInstance                                         │
└────────────┬──────────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────────┐
│        Axios Interceptors (axiosConfig.js)                   │
│                                                               │
│  Request Interceptor:                                         │
│  ├─ Add Authorization: Bearer ${token}                       │
│  ├─ Set baseURL from VITE_BACKEND_URL                        │
│  └─ Add timeout (10s)                                        │
│                                                               │
│  Response Interceptor:                                        │
│  ├─ Unwrap response.data.data                                │
│  ├─ Handle 401 → clearAuthData() → redirect /login           │
│  └─ Transform errors to Error objects                        │
└────────────┬──────────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────────┐
│              Backend API Server                               │
│  (Express, Node.js, or similar)                              │
└────────────┬──────────────────────────────────────────────────┘
             │
             ▼ (response)
┌──────────────────────────────────────────────────────────────┐
│         Response Data                                         │
│  {                                                            │
│    "data": { [...] },                                        │
│    "message": "Success"                                      │
│  }                                                            │
└────────────┬──────────────────────────────────────────────────┘
             │
             ▼ (Interceptor unwraps)
┌──────────────────────────────────────────────────────────────┐
│    Component Catches Response                                │
│  try {                                                        │
│    const data = await getMyApplications();                   │
│    setApplications(data);  ← setState triggers re-render     │
│  } catch (err) {                                             │
│    setError(err.message);                                    │
│  }                                                            │
└──────────────────────────────────────────────────────────────┘
```

### Layer 5: Component Hierarchy

```
App.jsx (Root)
│
├── BrowserRouter
│   └── Routes
│       │
│       ├── AuthLayout (Public routes)
│       │   ├── Login
│       │   ├── ForgotPassword
│       │   ├── ResetPassword
│       │   └── Signup variants
│       │
│       └── ProtectedRoute (Protected routes)
│           └── DashboardRouter
│               ├── JobSeekerDashboard
│               │   └── AppLayout
│               │       ├── DashboardHeader
│               │       ├── Sidebar with NAV_CONFIG[JOB_SEEKER]
│               │       ├── Main Content Area
│               │       │   ├── Stats Cards
│               │       │   ├── Job Listings
│               │       │   ├── Applications
│               │       │   └── Enrollments
│               │       └── DashboardFooter
│               │
│               ├── EmployerDashboard
│               │   └── AppLayout
│               │       ├── DashboardHeader
│               │       ├── Sidebar with NAV_CONFIG[EMPLOYER]
│               │       ├── Main Content Area
│               │       │   ├── Stats Cards
│               │       │   ├── Job Listings
│               │       │   ├── Applications
│               │       │   └── Interviews
│               │       └── DashboardFooter
│               │
│               ├── AdminDashboard
│               │   └── AppLayout
│               │       ├── AdminStatsCards
│               │       └── AdminShell
│               │           ├── AdminJobSeekers
│               │           ├── AdminEmployers
│               │           ├── AdminPrograms
│               │           ├── AdminPlacements
│               │           └── AdminReports
│               │
│               ├── OfficerDashboard
│               │   └── AppLayout
│               │       ├── Dashboard Stats
│               │       └── [Officer-specific views]
│               │
│               ├── AuditorDashboard
│               │   ├── AuditList
│               │   ├── ReportsOverview
│               │   └── EmptyState
│               │
│               └── ProgramManagerDashboard
│                   └── [Program Manager views]
```

---

## 🔄 State Management Strategy

### Local Component State (Primary)
- `useState` hooks in each page/component
- Examples:
  - `loading`, `error` states for API calls
  - `profile`, `applications`, `documents` data
  - `currentTab`, `isModalOpen` UI states

### Global/Persistent State (localStorage)
- Auth tokens and metadata in `localStorage` via `tokenStorage.js`
- Keys:
  - `workforce_token` → JWT Bearer token
  - `workforce_role` → User role
  - `workforce_username` → Username
  - `workforce_jobSeekerId` → Job seeker ID (if applicable)
  - `workforce_employerId` → Employer ID (if applicable)

### URL State (React Router)
- Navigation state passed via `useLocation()` hook
- Example in Login.jsx:
  ```jsx
  const location = useLocation();
  const successMsg = location.state?.message || '';
  ```
- Used for cross-page messaging

### Cached State (InterviewCache.js)
- Caches interview data locally to avoid repeated API calls
- Example: `localStorage.setItem('interviews_map', JSON.stringify({...}))`

**Why No Redux/Context API:**
- Simple data flow: Components fetch → setState
- Minimal cross-component state sharing
- Each role has isolated dashboards
- Added complexity isn't justified for current scope

---

## 📡 API Organization

### API File Naming Convention
- `{roleType}Api.js` → Contains all endpoints for that role
- Examples:
  - `jobSeekerApi.js` → `getMyProfile()`, `getMyApplications()`, `applyToJob()`
  - `employerApi.js` → `createJobPosting()`, `getApplicationsByJob()`, `updateApplicationStatus()`
  - `adminApi.js` → `getAllJobSeekers()`, `getAllEmployers()`, `getAllPlacements()`

### Central Configuration
- `axiosConfig.js`
  - Single axios instance exported to all API files
  - Request interceptor auto-attaches JWT token
  - Response interceptor handles 401 redirects
  - Error transformation to standardized Error objects

### Error Handling Pattern
```javascript
// All API methods throw Error objects
try {
  const data = await getMyApplications();
  setData(data);
} catch (err) {
  // err.message already contains human-readable message from interceptor
  setError(err.message);
}
```

---

## 🎨 UI/Layout Structure

### AppLayout Component
- **Purpose**: Wraps all authenticated pages with consistent layout
- **Props**: `pageTitle`, `children`
- **Features**:
  - Header (user info, notifications, logout)
  - Sidebar (role-based navigation)
  - Main content area
  - Footer
  - Quote rotation (motivational messages)

### Navigation Configuration (NAV_CONFIG)
- Role-specific sidebar menus defined in `AppLayout.jsx`
- Each role has different nav items:
  ```javascript
  NAV_CONFIG = {
    JOB_SEEKER: [
      { label: 'Dashboard', icon: 'bi-grid-1x2-fill', path: '/dashboard' },
      { label: 'Find Jobs', icon: 'bi-search-heart', path: '/dashboard' },
      { label: 'My Applications', icon: 'bi-briefcase-fill', path: '/dashboard/jobseeker/applications' },
      // ... more items
    ],
    EMPLOYER: [...],
    ADMIN: [...],
    OFFICER: [...],
    PROGRAM_MANAGER: [...],
    AUDITOR: [...]
  }
  ```

### Role Metadata (ROLE_META)
- Defines display properties for each role:
  ```javascript
  ROLE_META = {
    JOB_SEEKER: { label: 'Job Seeker', color: '#c084fc', emoji: '🚀' },
    EMPLOYER: { label: 'Employer', color: '#34d399', emoji: '🏢' },
    // ... more roles
  }
  ```

---

## 🔐 Security Implementation

### Authentication Flow
1. **Login Page** → User enters credentials
2. **API Call** → `authApi.login(username, password)` 
3. **Token Receipt** → Backend returns JWT + metadata
4. **Storage** → `tokenStorage.js` saves to localStorage
5. **Persistence** → Token persists across page refreshes
6. **Auto-Attach** → Request interceptor adds token to all requests
7. **Validation** → Backend validates token
8. **Logout** → 401 responses trigger `clearAuthData()` + redirect

### 401 Handling (Global)
```javascript
// In axiosConfig.js response interceptor
if (error.response?.status === 401) {
  clearAuthData();  // Remove all auth data from localStorage
  window.location.href = '/login';  // Redirect to login
}
```

### Route Protection
- `ProtectedRoute` component wraps all authenticated routes
- Checks `isAuthenticated()` before rendering
- Redirects to `/login` if not authenticated

### Role-Based Access Control (RBAC)
```javascript
// In each dashboard page
const role = getRole();
if (role !== 'EXPECTED_ROLE') {
  return <Navigate to="/login" replace />;
}
```

---

## 🚀 Data Flow Examples

### Example 1: Job Seeker Views Applications

```
1. JobSeekerDashboard mounts
   └─ useEffect runs (empty dependency array)
   
2. Inside useEffect:
   └─ setLoading(true)
   └─ Call: getMyApplications() from jobSeekerApi.js
   
3. jobSeekerApi.getMyApplications():
   └─ Call: axiosInstance.get('/applications/my')
   
4. Axios Request Interceptor:
   └─ Adds: Authorization: Bearer {token}
   └─ Sets: baseURL from VITE_BACKEND_URL
   
5. Backend processes request
   └─ Validates JWT token
   └─ Queries database for user's applications
   └─ Returns: { data: [{appId, jobTitle, status, ...}] }
   
6. Axios Response Interceptor:
   └─ Extracts: response.data.data
   └─ Returns: [{appId, jobTitle, status, ...}]
   
7. Component catches response:
   └─ setApplications(data)
   └─ React re-renders with applications list
   └─ setLoading(false)
   
8. User sees applications in table/cards
```

### Example 2: Employer Creates Job Posting

```
1. CreateJob page loads
   └─ User fills form (title, description, salary, etc.)
   
2. Form submission (handleSubmit):
   └─ setLoading(true)
   └─ Validate input fields
   
3. API Call: createJobPosting(payload)
   └─ payload = { title, description, salary, ... }
   
4. employerApi.createJobPosting():
   └─ Validates: payload exists, required fields filled
   └─ Calls: axiosInstance.post('/jobs', payload)
   
5. Axios Request Interceptor:
   └─ Adds: Authorization: Bearer {token}
   └─ Adds: employerID from localStorage
   
6. Backend processes:
   └─ Verifies employer token
   └─ Saves job posting to database
   └─ Returns: { data: { jobID, status: 'OPEN', ... } }
   
7. Component catches success:
   └─ Show success message
   └─ Navigate to /dashboard/employer/jobs
   
8. Error handling:
   └─ If error: catch block → setError(err.message)
   └─ Show error alert to user
   └─ finally: setLoading(false)
```

### Example 3: Admin Views All Users

```
1. AdminDashboard mounts
   └─ useEffect runs
   
2. Load all data in parallel:
   └─ Promise.allSettled([
       getAllJobSeekers(),
       getAllEmployers(),
       getAllPlacements(),
       getAllApplications()
     ])
   
3. Each API call:
   └─ adminApi.getAllJobSeekers() 
   └─ axiosInstance.get('/admin/jobseekers')
   └─ Request Interceptor adds token
   
4. Backend responses:
   └─ Returns arrays of data
   
5. Component displays:
   └─ Stats cards with counts
   └─ Admin tables with data
   └─ Status badges for each user
   
6. Partial failures handled:
   └─ If one API fails, others still display
   └─ Error shown only for failed section
```

---

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| React | 19.2.5 | UI component framework |
| React DOM | 19.2.5 | React DOM rendering |
| React Router DOM | 7.15.0 | Client-side routing |
| Axios | 1.16.0 | HTTP client for API calls |
| Recharts | 3.8.1 | Data visualization/charts for dashboards |
| Vite | 5.0.8 | Build tool & dev server |
| @vitejs/plugin-react | 4.2.1 | Vite plugin for React |

---

## 🔧 Environment Configuration

### Environment Variables
- `VITE_BACKEND_URL` → Backend API base URL
  - Development: `http://localhost:3000` (or backend port)
  - Production: `https://api.workforce.com`

### Access in Code
```javascript
// In axiosConfig.js
const getBackendUrl = () => import.meta.env.VITE_BACKEND_URL;
```

---

## ✅ Routing Summary

| Route | Protected | Layout | Purpose |
|-------|-----------|--------|---------|
| `/login` | No | AuthLayout | User login |
| `/forgot-password` | No | AuthLayout | Password recovery |
| `/reset-password` | No | AuthLayout | Password reset |
| `/signup` | No | AuthLayout | Role selection |
| `/signup/jobseeker` | No | AuthLayout | Job seeker registration |
| `/signup/employer` | No | AuthLayout | Employer registration |
| `/dashboard` | Yes | AppLayout | Role-based dashboard entry |
| `/dashboard/jobseeker/*` | Yes | AppLayout | Job seeker pages |
| `/dashboard/employer/*` | Yes | AppLayout | Employer pages |
| `/dashboard/admin/*` | Yes | AppLayout | Admin pages |
| `/dashboard/officer/*` | Yes | AppLayout | Officer pages |
| `/dashboard/auditor/*` | Yes | AppLayout | Auditor pages |
| `/dashboard/program-manager/*` | Yes | AppLayout | Program manager pages |
| `/about-us` | No | None | Static page |
| `/contact-us` | No | None | Static page |

---

## 🎯 Key Architectural Decisions

### 1. **No Global State Management**
- ✅ Simple, no Redux/Context overhead
- ✅ Each component manages its own state
- ❌ Potential for prop drilling in deeply nested components

### 2. **Role-Based Routing (DashboardRouter)**
- ✅ Clean separation of concerns per role
- ✅ Easy to add new roles
- ❌ Duplicate code across dashboard pages

### 3. **Centralized API Layer**
- ✅ Single source of truth for API calls
- ✅ Easy to update endpoints
- ✅ Consistent error handling
- ❌ All API files must be manually created

### 4. **localStorage for Auth**
- ✅ Persists across page refreshes
- ✅ Simple implementation
- ❌ XSS vulnerability (mitigated with Content Security Policy)

### 5. **Promise.allSettled for Dashboard Data**
- ✅ Partial failures don't break entire dashboard
- ✅ Better UX (show what loaded, hide what failed)
- ❌ More verbose error handling code

---

## 🚀 Performance Considerations

1. **Code Splitting**: Lazy load role-specific dashboards if bundle gets large
2. **Memoization**: Use `React.memo()` for expensive components
3. **API Caching**: Implement Redis-like cache in `InterviewCache.js`
4. **Image Optimization**: Compress logo.jpg and other static assets
5. **Debounce**: Debounce search inputs to reduce API calls

---

This architecture provides a **scalable, maintainable, and role-based** frontend for a multi-tenant employment platform.
