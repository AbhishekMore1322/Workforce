import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import AppLayout from '../../components/AppLayout';
import EmptyState from './components/EmptyState';
import ApplicationCard from './components/ApplicationCard';
import ApplicationNoteModal from './components/ApplicationNoteModal';
import InterviewScheduleModal from './components/InterviewScheduleModal';
import InterviewResultModal from './components/InterviewResultModal';
import ViewResumeModal from './components/ViewResumeModal';

import {
  getApplicationsByJob,
  getEmployerInterviews,
  updateApplicationStatus,
  addApplicationNote,
  scheduleInterview,
  updateInterviewStatus,
  getLatestResume,
} from '../../api/employerApi';

const JobApplications = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();

  const [applications, setApplications]   = useState([]);
  const [interviewMap, setInterviewMap]   = useState({}); // keyed by applicationID
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState('');

  const [selectedApp, setSelectedApp]     = useState(null);
  const [showNote, setShowNote]           = useState(false);
  const [showInterview, setShowInterview] = useState(false);
  const [showResult, setShowResult]       = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError]     = useState('');

  const [showResume, setShowResume]       = useState(false);
  const [resumeUrl, setResumeUrl]         = useState('');
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeError, setResumeError]     = useState('');

  /* ── Load applications + interviews together ── */
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const [appsData, interviewsData] = await Promise.all([
        getApplicationsByJob(jobId),
        getEmployerInterviews(),
      ]);

      const apps = Array.isArray(appsData) ? appsData : [];

      // normalize interviews list from whatever shape the API returns
      const rawInterviews = Array.isArray(interviewsData)
        ? interviewsData
        : Array.isArray(interviewsData?.interviews)
        ? interviewsData.interviews
        : Array.isArray(interviewsData?.items)
        ? interviewsData.items
        : [];

      // build map: applicationID -> interview object
      const map = {};
      for (const iv of rawInterviews) {
        const appId = iv.applicationID ?? iv.application_id;
        if (appId != null) {
          map[String(appId)] = {
            interviewID: iv.interviewID ?? iv.id ?? iv.interview_id,
            status:      iv.status,
            result:      iv.result ?? null,
          };
        }
      }

      setApplications(apps);
      setInterviewMap(map);
    } catch (e) {
      setError(e.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => { loadData(); }, [loadData]);

  /* ── Open modal helper — clears stale errors ── */
  const openModal = (setter, app) => {
    setSelectedApp(app);
    setActionError('');
    setter(true);
  };

  /* ── Approve / Reject ── */
  const approve = async (id) => {
    try {
      await updateApplicationStatus(id, 'APPROVED');
      await loadData();
    } catch (e) {
      setError(e.message || 'Failed to approve application');
    }
  };

  const reject = async (id) => {
    try {
      await updateApplicationStatus(id, 'REJECTED');
      await loadData();
    } catch (e) {
      setError(e.message || 'Failed to reject application');
    }
  };

  /* ── Add note ── */
  const submitNote = async (notes) => {
    try {
      setActionLoading(true);
      await addApplicationNote(selectedApp.applicationID, notes);
      setShowNote(false);
    } catch (e) {
      setActionError(e.message || 'Failed to save note');
    } finally {
      setActionLoading(false);
    }
  };

  /* ── Schedule interview ── */
  const submitInterview = async ({ date, time }) => {
    try {
      setActionLoading(true);
      await scheduleInterview({
        applicationID: selectedApp.applicationID,
        employerID: Number(localStorage.getItem('workforce_employerId')),
        date,
        time,
      });
      setShowInterview(false);
      // reload from API — interview now exists in backend
      await loadData();
    } catch (e) {
      setActionError(e.message || 'Failed to schedule interview');
    } finally {
      setActionLoading(false);
    }
  };

  /* ── Update interview result ── */
  const submitResult = async (result) => {
    try {
      setActionLoading(true);
      const interview = interviewMap[String(selectedApp.applicationID)];
      await updateInterviewStatus(interview.interviewID, {
        status: 'COMPLETED',
        result,
      });
      setShowResult(false);
      await loadData();
    } catch (e) {
      setActionError(e.message || 'Failed to update interview result');
    } finally {
      setActionLoading(false);
    }
  };

  /* ── View resume ── */
  const viewLatestResume = async (application) => {
    try {
      setResumeLoading(true);
      setResumeError('');
      if (!application.seekerID) throw new Error('Job seeker ID missing');
      const url = await getLatestResume(application.seekerID);
      setResumeUrl(url);
      setShowResume(true);
    } catch (e) {
      setResumeError(e.message || 'Failed to load resume');
      setResumeUrl('');
      setShowResume(true);
    } finally {
      setResumeLoading(false);
    }
  };

  return (
    <AppLayout pageTitle="Job Applications">
      <div className="container py-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h3 className="fw-bold" style={{ color: '#00796b' }}>Job Applications</h3>
            <p className="text-muted mb-0">Manage applications for this job posting.</p>
          </div>
          <button className="btn btn-outline-secondary" onClick={() => navigate('/dashboard/employer/jobs')}>
            Back to Jobs
          </button>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small mb-3">
            <i className="fas fa-exclamation-triangle me-2" />{error}
          </div>
        )}

        {loading ? (
          <EmptyState title="Loading applications" icon="fa-spinner" />
        ) : applications.length === 0 ? (
          <EmptyState title="No applications yet" description="Candidates will appear here once they apply." />
        ) : (
          <div className="row g-4">
            {applications.map((app) => (
              <ApplicationCard
                key={app.applicationID}
                application={app}
                interview={interviewMap[String(app.applicationID)]}
                onApprove={() => approve(app.applicationID)}
                onReject={() => reject(app.applicationID)}
                onAddNote={() => openModal(setShowNote, app)}
                onScheduleInterview={() => openModal(setShowInterview, app)}
                onUpdateResult={() => openModal(setShowResult, app)}
                onViewResume={() => viewLatestResume(app)}
              />
            ))}
          </div>
        )}
      </div>

      <ApplicationNoteModal
        open={showNote}
        onClose={() => setShowNote(false)}
        onSave={submitNote}
        loading={actionLoading}
        error={actionError}
      />

      <InterviewScheduleModal
        open={showInterview}
        onClose={() => setShowInterview(false)}
        onSave={submitInterview}
        loading={actionLoading}
        error={actionError}
      />

      <InterviewResultModal
        open={showResult}
        onClose={() => setShowResult(false)}
        onSave={submitResult}
        loading={actionLoading}
        error={actionError}
      />

      <ViewResumeModal
        open={showResume}
        onClose={() => setShowResume(false)}
        resumeUrl={resumeUrl}
        loading={resumeLoading}
        error={resumeError}
      />
    </AppLayout>
  );
};

export default JobApplications;
