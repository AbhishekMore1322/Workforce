import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJobSeekerId, getUsername } from '../../utils/tokenStorage';
import DashboardStatCard from '../jobSeeker/components/DashboardStatCard';
import JobPostingCard from './components/JobPostingCard';
import JobSeekerLayout from './components/JobSeekerLayout';
import {
  getMyDocuments, getMyEnrollments, getMyApplications,
  getMyProfile, getAllJobPostings, searchJobPostings, getJobPostingById, applyToJob,
} from '../../api/jobSeekerApi';

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const jobSeekerId = getJobSeekerId();
  const username    = getUsername();

  const [loading, setLoading]               = useState(true);
  const [profile, setProfile]               = useState(null);
  const [documents, setDocuments]           = useState([]);
  const [enrollments, setEnrollments]       = useState([]);
  const [applications, setApplications]     = useState([]);
  const [error, setError]                   = useState('');
  const [jobsLoading, setJobsLoading]       = useState(false);
  const [jobs, setJobs]                     = useState([]);
  const [showJobs, setShowJobs]             = useState(false);
  const [jobActionLoadingId, setJobActionLoadingId] = useState(null);
  const [jobBoardMsg, setJobBoardMsg]       = useState('');
  const [jobSearch, setJobSearch]           = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [p, d, e, a] = await Promise.allSettled([
          getMyProfile(), getMyDocuments(), getMyEnrollments(), getMyApplications(),
        ]);
        setProfile(p.status === 'fulfilled' ? p.value : null);
        setDocuments(d.status === 'fulfilled' && Array.isArray(d.value) ? d.value : []);
        setEnrollments(e.status === 'fulfilled' && Array.isArray(e.value) ? e.value : []);
        setApplications(a.status === 'fulfilled' && Array.isArray(a.value) ? a.value : []);
      } catch (err) {
        setError(err?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const profileCompletion = useMemo(() => {
    if (!profile) return { label: 'Basic', pct: 45 };
    const fields = [profile?.name, profile?.dob, profile?.gender, profile?.address, profile?.contactInfo, profile?.skillsJSON];
    const pct = Math.round((fields.filter(Boolean).length / fields.length) * 100);
    return { pct, label: pct >= 85 ? 'Complete' : 'In Progress' };
  }, [profile]);

  const docsUploaded = documents.length;
  const activeApplications = applications.filter(a => {
    const s = String(a?.status || '').toUpperCase();
    return !s.includes('REJECT') && !s.includes('WITHDRAW') && !s.includes('CLOSED');
  }).length;

  const appliedJobIdSet = useMemo(() => {
    const set = new Set();
    for (const app of applications || []) {
      const id = app?.jobID ?? app?.jobId ?? app?.job_id ?? app?.job?.id ?? app?.job?._id;
      if (id != null) set.add(String(id));
    }
    return set;
  }, [applications]);

  const loadJobs = async () => {
    setJobBoardMsg(''); setJobsLoading(true);
    try {
      const data = jobSearch.trim()
        ? await searchJobPostings(jobSearch)
        : await getAllJobPostings();
      setJobs(Array.isArray(data) ? data : []);
      setShowJobs(true);
    } catch (e) {
      setJobBoardMsg(e?.message || 'Failed to load job postings');
      setShowJobs(true); setJobs([]);
    } finally { setJobsLoading(false); }
  };

  const hasResume = useMemo(() => {
    return documents.some(d => String(d?.docType || '').toUpperCase() === 'RESUME');
  }, [documents]);

  const [showResumePopup, setShowResumePopup] = useState(false);

  const handleApply = async (job) => {
    const id = job?.id ?? job?.jobID ?? job?._id;
    if (!id) return;
    if (!hasResume) {
      setShowResumePopup(true);
      return;
    }
    setJobBoardMsg(''); setJobActionLoadingId(id);
    try {
      await getJobPostingById(id);
      await applyToJob(id);
      setJobBoardMsg('Applied successfully! Track updates in "My Applications".');
    } catch (e) {
      setJobBoardMsg(e?.message || 'Failed to apply');
    } finally { setJobActionLoadingId(null); }
  };

  const filteredJobs = useMemo(() => {
    // When search was done via backend, jobs are already filtered; just return them
    return jobs;
  }, [jobs]);

  if (loading) return (
    <JobSeekerLayout pageTitle="Dashboard">
      <div className="wf-loading"><div className="wf-loading__spinner" />Loading your dashboard...</div>
    </JobSeekerLayout>
  );

  return (
    <>
    <JobSeekerLayout pageTitle="Dashboard">

      {/* Welcome banner */}
      <div className="wf-welcome">
        <div className="wf-welcome__title">Hello, {username || 'Job Seeker'}! 👋</div>
        <p className="wf-welcome__sub">Your career command centre — everything in one place.</p>
      </div>

      {error && <div className="alert alert-warning mb-4">{error}</div>}

      {/* Stat cards */}
      <div className="row g-3 mb-4">
        {[
          { icon: 'fa-id-card',     label: 'Profile',      value: `${profileCompletion.pct}%`, helper: profileCompletion.label },
          { icon: 'fa-file',        label: 'Documents',    value: `${docsUploaded}`,            helper: 'Uploaded documents' },
          { icon: 'fa-book-reader', label: 'Enrolled',     value: `${enrollments.length}`,      helper: 'Training programs' },
          { icon: 'fa-paper-plane', label: 'Applications', value: `${activeApplications}`,      helper: 'Active & tracking' },
        ].map(s => (
          <div className="col-6 col-xl-3" key={s.label}>
            <DashboardStatCard icon={s.icon} label={s.label} value={s.value} helper={s.helper} />
          </div>
        ))}
      </div>

      {/* Profile progress */}
      <div className="wf-page-card mb-4">
        <div className="wf-page-card__body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, fontSize: '0.875rem', color: '#0f0e17' }}>
              Profile Completion
            </span>
            <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1rem', color: '#7c3aed' }}>
              {profileCompletion.pct}%
            </span>
          </div>
          <div className="progress mb-2">
            <div className="progress-bar" style={{ width: `${profileCompletion.pct}%` }} />
          </div>
          <div style={{ fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: '0.75rem', color: '#a0a8b8' }}>
            {profileCompletion.label} — {profileCompletion.pct < 100 && (
              <button
                onClick={() => navigate('/dashboard/jobseeker/profile/edit')}
                style={{ background: 'none', border: 'none', padding: 0, color: '#7c3aed', fontWeight: 700, cursor: 'pointer', fontSize: '0.75rem' }}
              >
                Complete now →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Find Jobs */}
      <div className="wf-page-card mb-4">
        <div className="wf-page-card__header">
          <h2 className="wf-page-card__title"><i className="bi bi-search-heart me-2" style={{ color: '#7c3aed' }} />Find Jobs</h2>
        </div>
        <div className="wf-page-card__body">
          <div className="d-flex gap-2 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title, company or location…"
              value={jobSearch}
              onChange={e => setJobSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && loadJobs()}
            />
            <button className="btn btn-primary px-4" onClick={loadJobs} disabled={jobsLoading}>
              {jobsLoading ? <span className="spinner-border spinner-border-sm" /> : <><i className="bi bi-search me-1" />Search</>}
            </button>
          </div>

          {jobBoardMsg && <div className="alert alert-info py-2 small">{jobBoardMsg}</div>}

          {showJobs && (
            jobsLoading ? (
              <div className="wf-loading"><div className="wf-loading__spinner" />Loading jobs…</div>
            ) : filteredJobs.length === 0 ? (
              <div className="alert alert-warning small">No job postings found.</div>
            ) : (
              <div className="row g-3">
                {filteredJobs.map(job => {
                  const jid = job?.id ?? job?.jobID ?? job?._id;
                  return (
                    <div className="col-12 col-md-6" key={jid}>
                      <JobPostingCard
                        job={job}
                        isApplying={jobActionLoadingId === jid}
                        isApplied={appliedJobIdSet.has(String(jid))}
                        onApply={handleApply}
                      />
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="wf-page-card mb-4">
        <div className="wf-page-card__header">
          <h2 className="wf-page-card__title"><i className="bi bi-lightning-charge-fill me-2" style={{ color: '#f97316' }} />Quick Actions</h2>
        </div>
        <div className="wf-page-card__body">
          <div className="row g-3">
            {[
              { icon: 'bi-person-bounding-box', label: 'View Profile',      path: '/dashboard/jobseeker/profile',           color: '#7c3aed' },
              { icon: 'bi-upload',              label: 'Upload Document',   path: '/dashboard/jobseeker/documents/upload',   color: '#a855f7', disabled: !jobSeekerId },
              { icon: 'bi-mortarboard-fill',    label: 'Browse Training',   path: '/dashboard/jobseeker/training-programs',  color: '#f97316' },
              { icon: 'bi-briefcase-fill',      label: 'My Applications',   path: '/dashboard/jobseeker/applications',       color: '#3b82f6' },
            ].map(q => (
              <div className="col-6 col-md-3" key={q.label}>
                <button className="wf-quick-btn" onClick={() => navigate(q.path)} disabled={q.disabled}>
                  <i className={`bi ${q.icon}`} style={{ color: q.color, fontSize: '1.6rem' }} />
                  <span>{q.label}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="wf-page-card">
        <div className="wf-page-card__header">
          <h2 className="wf-page-card__title"><i className="bi bi-arrow-right-circle-fill me-2" style={{ color: '#3b82f6' }} />Your Next Steps</h2>
        </div>
        <div className="wf-page-card__body">
          <div className="d-grid gap-2">
            <button className="btn btn-outline-primary" onClick={() => navigate('/dashboard/jobseeker/enrollments')}>
              <i className="bi bi-journal-check me-2" />View My Enrollments
            </button>
            <button className="btn btn-outline-primary" onClick={() => navigate('/dashboard/jobseeker/applications')}>
              <i className="bi bi-briefcase me-2" />View My Applications
            </button>
          </div>
        </div>
      </div>

    </JobSeekerLayout>

    {showResumePopup && (
      <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold">Resume Required</h5>
              <button className="btn-close" onClick={() => setShowResumePopup(false)} />
            </div>
            <div className="modal-body text-center py-4">
              <div className="mb-3">
                <i className="bi bi-file-earmark-person" style={{ fontSize: '3rem', color: '#7c3aed' }} />
              </div>
              <p className="mb-1 fw-semibold">You need to upload a resume before applying.</p>
              <p className="text-muted small">Please upload your resume in the Documents section first.</p>
            </div>
            <div className="modal-footer border-0 pt-0 justify-content-center gap-2">
              <button className="btn btn-outline-secondary" onClick={() => setShowResumePopup(false)}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={() => { setShowResumePopup(false); navigate('/dashboard/jobseeker/documents/upload'); }}
              >
                Upload Resume
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default JobSeekerDashboard;
