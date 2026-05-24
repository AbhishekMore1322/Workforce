import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import './App.css';

/* ── Auth ── */
import Login              from './pages/auth/Login';
import ForgotPassword     from './pages/auth/ForgotPassword';
import ResetPassword      from './pages/auth/ResetPassword';
import SignupChoice       from './pages/signup/SignupChoice';
import SignupJobSeeker    from './pages/signup/SignupJobSeeker';
import SignupEmployer     from './pages/signup/SignupEmployer';

/* ── Admin ── */
import AdminDashboard  from './pages/admin/AdminDashboard';
import AdminOverview   from './pages/admin/AdminOverview';
import AdminJobSeekers from './pages/admin/AdminJobSeekers';
import AdminEmployers  from './pages/admin/AdminEmployers';
import AdminPrograms   from './pages/admin/AdminPrograms';
import AdminPlacements from './pages/admin/AdminPlacements';
import AdminReports    from './pages/admin/AdminReports';

/* ── Officer ── */
import OfficerDashboard         from './pages/officer/OfficerDashboard';
import OfficerJobSeekers        from './pages/officer/OfficerJobSeekers';
import OfficerEmployers         from './pages/officer/OfficerEmployers';
import OfficerApplications      from './pages/officer/OfficerApplications';
import OfficerPlacements        from './pages/officer/OfficerPlacements';
import OfficerCompliance        from './pages/officer/OfficerCompliance';
import OfficerComplianceReports from './pages/officer/OfficerComplianceReports';

/* ── Auditor ── */
import AuditorDashboard from './pages/auditor/AuditorDashboard';

/* ── Program Manager ── */
import ProgramManagerDashboard        from './pages/programManager/ProgramManagerDashboard';
import ProgramManagerTrainingPrograms from './pages/programManager/TrainingPrograms';
import CreateTrainingProgram          from './pages/programManager/CreateTrainingProgram';
import ProgramDetails                 from './pages/programManager/ProgramDetails';
import ProgramEnrollments             from './pages/programManager/ProgramEnrollments';
import TrainingReports                from './pages/programManager/TrainingReports';

/* ── Job Seeker ── */
import JobSeekerDashboard        from './pages/jobseeker/JobSeekerDashboard';
import JobSeekerProfile          from './pages/jobseeker/JobSeekerProfile';
import EditJobSeekerProfile      from './pages/jobseeker/EditJobSeekerProfile';
import JobSeekerDocuments        from './pages/jobseeker/JobSeekerDocuments';
import UploadDocument            from './pages/jobseeker/UploadDocument';
import JobSeekerTrainingPrograms from './pages/jobseeker/TrainingPrograms';
import MyEnrollments             from './pages/jobseeker/MyEnrollments';
import MyApplications            from './pages/jobseeker/MyApplications';

/* ── Employer ── */
import EmployerDashboard   from './pages/employer/EmployerDashboard';
import EmployerProfile     from './pages/employer/EmployerProfile';
import EditEmployerProfile from './pages/employer/EditEmployerProfile';
import JobListings         from './pages/employer/JobListings';
import CreateJob           from './pages/employer/CreateJob';
import EditJob             from './pages/employer/EditJob';
import JobApplications     from './pages/employer/JobApplications';
import Placements          from './pages/employer/Placements';
import EmployerInterviews  from './pages/employer/EmployerInterviews';

/* ── Static ── */
import AboutUs   from './pages/AboutUs';
import ContactUs from './pages/ContactUs';

import { getRole } from './utils/tokenStorage';

/* ─────────────────────────────────────────
   Auth Layout
───────────────────────────────────────── */
const AuthLayout = ({ children, subtitle }) => (
  <div className="auth-root">
    <div className="auth-brand-panel d-none d-lg-flex">
      <div className="auth-brand-inner">
        <div className="auth-brand-logo">
          <img src="/logo.jpg" alt="WorkForce" />
        </div>
        <h1 className="auth-brand-title">WorkForce</h1>
        <p className="auth-brand-sub">Powering the Future of Placement.</p>
        <div className="auth-brand-features">
          <div className="auth-feature-item"><i className="bi bi-briefcase-fill" /><span>Smart Job Matching</span></div>
          <div className="auth-feature-item"><i className="bi bi-mortarboard-fill" /><span>Training & Upskilling</span></div>
          <div className="auth-feature-item"><i className="bi bi-graph-up-arrow" /><span>Career Growth Tracking</span></div>
          <div className="auth-feature-item"><i className="bi bi-shield-check" /><span>Verified Employers</span></div>
        </div>
      </div>
      <div className="auth-brand-footer">© 2026 WorkForce Employment Services</div>
    </div>
    <div className="auth-form-panel">
      <div className="auth-form-inner">
        <div className="d-lg-none text-center mb-4">
          <img src="/logo.jpg" alt="WorkForce" className="auth-mobile-logo" />
          <h4 className="fw-bold mt-2 text-primary">WorkForce</h4>
        </div>
        {subtitle && <p className="auth-form-subtitle">{subtitle}</p>}
        {children}
        <div className="text-center mt-4 text-muted small d-lg-none">© 2026 WorkForce Employment Services</div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   /dashboard → redirect to role home
───────────────────────────────────────── */
const ROLE_HOME = {
  ADMIN:           '/dashboard/admin',
  OFFICER:         '/dashboard/officer',
  AUDITOR:         '/dashboard/auditor',
  PROGRAM_MANAGER: '/dashboard/program-manager',
  EMPLOYER:        '/dashboard/employer',
  JOB_SEEKER:      '/dashboard/jobseeker',
};

const DashboardRedirect = () => {
  const path = ROLE_HOME[getRole()];
  return path ? <Navigate to={path} replace /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public / Auth ── */}
        <Route path="/login"           element={<AuthLayout subtitle="Welcome back! Please login to your account."><Login /></AuthLayout>} />
        <Route path="/forgot-password" element={<AuthLayout subtitle="Recover access to your account."><ForgotPassword /></AuthLayout>} />
        <Route path="/reset-password"  element={<AuthLayout subtitle="Choose a new password."><ResetPassword /></AuthLayout>} />
        <Route path="/signup"          element={<AuthLayout subtitle="Choose your path to get started."><SignupChoice /></AuthLayout>} />
        <Route path="/signup/jobseeker" element={<SignupJobSeeker />} />
        <Route path="/signup/employer"  element={<SignupEmployer />} />

        {/* ── /dashboard → role redirect ── */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />

        {/* ────────────────────────────────────────────────────────
            ADMIN — layout with persistent nav, children via Outlet
        ──────────────────────────────────────────────────────── */}
        <Route path="/dashboard/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>}>
          <Route index             element={<AdminOverview />} />
          <Route path="jobseekers" element={<AdminJobSeekers />} />
          <Route path="employers"  element={<AdminEmployers />} />
          <Route path="programs"   element={<AdminPrograms />} />
          <Route path="placements" element={<AdminPlacements />} />
          <Route path="reports"    element={<AdminReports />} />
        </Route>

        {/* ────────────────────────────────────────────────────────
            OFFICER — layout with persistent shell, children via Outlet
        ──────────────────────────────────────────────────────── */}
        <Route path="/dashboard/officer" element={<ProtectedRoute allowedRoles={['OFFICER']}><OfficerDashboard /></ProtectedRoute>}>
          <Route index                 element={<Navigate to="jobseekers" replace />} />
          <Route path="jobseekers"     element={<OfficerJobSeekers />} />
          <Route path="employers"      element={<OfficerEmployers />} />
          <Route path="applications"   element={<OfficerApplications />} />
          <Route path="placements"     element={<OfficerPlacements />} />
          <Route path="compliance"     element={<OfficerCompliance />} />
          <Route path="compliance-reports" element={<OfficerComplianceReports />} />
        </Route>

        {/* ────────────────────────────────────────────────────────
            AUDITOR — single page
        ──────────────────────────────────────────────────────── */}
        <Route path="/dashboard/auditor" element={<ProtectedRoute allowedRoles={['AUDITOR']}><AuditorDashboard /></ProtectedRoute>} />

        {/* ────────────────────────────────────────────────────────
            PROGRAM MANAGER — flat routes (each page is self-contained)
        ──────────────────────────────────────────────────────── */}
        <Route path="/dashboard/program-manager"                     element={<ProtectedRoute allowedRoles={['PROGRAM_MANAGER']}><ProgramManagerDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/program-manager/programs"            element={<ProtectedRoute allowedRoles={['PROGRAM_MANAGER']}><ProgramManagerTrainingPrograms /></ProtectedRoute>} />
        <Route path="/dashboard/program-manager/create"              element={<ProtectedRoute allowedRoles={['PROGRAM_MANAGER']}><CreateTrainingProgram /></ProtectedRoute>} />
        <Route path="/dashboard/program-manager/program-details"     element={<ProtectedRoute allowedRoles={['PROGRAM_MANAGER']}><ProgramDetails /></ProtectedRoute>} />
        <Route path="/dashboard/program-manager/program-enrollments" element={<ProtectedRoute allowedRoles={['PROGRAM_MANAGER']}><ProgramEnrollments /></ProtectedRoute>} />
        <Route path="/dashboard/program-manager/reports"             element={<ProtectedRoute allowedRoles={['PROGRAM_MANAGER']}><TrainingReports /></ProtectedRoute>} />

        {/* ────────────────────────────────────────────────────────
            JOB SEEKER — flat routes (each page is self-contained)
        ──────────────────────────────────────────────────────── */}
        <Route path="/dashboard/jobseeker"                   element={<ProtectedRoute allowedRoles={['JOB_SEEKER']}><JobSeekerDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/jobseeker/profile"           element={<ProtectedRoute allowedRoles={['JOB_SEEKER']}><JobSeekerProfile /></ProtectedRoute>} />
        <Route path="/dashboard/jobseeker/profile/edit"      element={<ProtectedRoute allowedRoles={['JOB_SEEKER']}><EditJobSeekerProfile /></ProtectedRoute>} />
        <Route path="/dashboard/jobseeker/documents"         element={<ProtectedRoute allowedRoles={['JOB_SEEKER']}><JobSeekerDocuments /></ProtectedRoute>} />
        <Route path="/dashboard/jobseeker/documents/upload"  element={<ProtectedRoute allowedRoles={['JOB_SEEKER']}><UploadDocument /></ProtectedRoute>} />
        <Route path="/dashboard/jobseeker/training-programs" element={<ProtectedRoute allowedRoles={['JOB_SEEKER']}><JobSeekerTrainingPrograms /></ProtectedRoute>} />
        <Route path="/dashboard/jobseeker/enrollments"       element={<ProtectedRoute allowedRoles={['JOB_SEEKER']}><MyEnrollments /></ProtectedRoute>} />
        <Route path="/dashboard/jobseeker/applications"      element={<ProtectedRoute allowedRoles={['JOB_SEEKER']}><MyApplications /></ProtectedRoute>} />

        {/* ────────────────────────────────────────────────────────
            EMPLOYER — flat routes (each page is self-contained)
        ──────────────────────────────────────────────────────── */}
        <Route path="/dashboard/employer"                          element={<ProtectedRoute allowedRoles={['EMPLOYER']}><EmployerDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/employer/profile"                  element={<ProtectedRoute allowedRoles={['EMPLOYER']}><EmployerProfile /></ProtectedRoute>} />
        <Route path="/dashboard/employer/profile/edit"             element={<ProtectedRoute allowedRoles={['EMPLOYER']}><EditEmployerProfile /></ProtectedRoute>} />
        <Route path="/dashboard/employer/jobs"                     element={<ProtectedRoute allowedRoles={['EMPLOYER']}><JobListings /></ProtectedRoute>} />
        <Route path="/dashboard/employer/jobs/create"              element={<ProtectedRoute allowedRoles={['EMPLOYER']}><CreateJob /></ProtectedRoute>} />
        <Route path="/dashboard/employer/jobs/:jobId/edit"         element={<ProtectedRoute allowedRoles={['EMPLOYER']}><EditJob /></ProtectedRoute>} />
        <Route path="/dashboard/employer/jobs/:jobId/applications" element={<ProtectedRoute allowedRoles={['EMPLOYER']}><JobApplications /></ProtectedRoute>} />
        <Route path="/dashboard/employer/placements"               element={<ProtectedRoute allowedRoles={['EMPLOYER']}><Placements /></ProtectedRoute>} />
        <Route path="/dashboard/employer/interviews"               element={<ProtectedRoute allowedRoles={['EMPLOYER']}><EmployerInterviews /></ProtectedRoute>} />

        {/* ── Static ── */}
        <Route path="/about"   element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />

        {/* ── Fallback ── */}
        <Route path="/"  element={<Navigate to="/login" replace />} />
        <Route path="*"  element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
