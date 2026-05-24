import React, { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getRole } from '../../utils/tokenStorage';

import DashboardHeader from '../../components/DashboardHeader';
import DashboardFooter from '../../components/DashboardFooter';
import DashboardStatCard from '../jobSeeker/components/DashboardStatCard';

import { getAllApplications, updateApplicationStatus, addApplicationNote } from '../../api/officerApi';

const STATUS_BADGE = ({ status }) => {
  const s = String(status || '').toUpperCase();
  let cls = 'bg-secondary';
  if (s === 'ACTIVE' || s === 'VERIFIED' || s === 'APPROVED' || s === 'SELECTED') cls = 'bg-success';
  if (s === 'INACTIVE' || s === 'REJECTED' || s === 'WITHDRAWN') cls = 'bg-danger';
  if (s.includes('PEND')) cls = 'bg-warning text-dark';

  return (
    <span className={`badge ${cls} me-1`}>
      {s || '—'}
    </span>
  );
};

const EmptyState = ({ title, description, icon }) => {
  return (
    <div className="text-center py-5">
      <div className="text-muted mb-3">
        <i className={`fas ${icon || 'fa-file-alt'} fa-3x`} />
      </div>
      <h4 className="fw-bold mb-2">{title}</h4>
      <p className="text-muted mb-0">{description}</p>
    </div>
  );
};

const OfficerApplications = () => {
  const role = getRole();
  if (role !== 'OFFICER') return <Navigate to="/login" replace />;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applications, setApplications] = useState([]);

  const [noteOpen, setNoteOpen] = useState(false);
  const [noteLoading, setNoteLoading] = useState(false);
  const [noteApplicationId, setNoteApplicationId] = useState(null);
  const [notesValue, setNotesValue] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getAllApplications();
        setApplications(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e?.message || 'Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter((a) => {
      const st = String(a?.status || '').toUpperCase();
      return st !== 'APPROVED' && st !== 'REJECTED' && st !== 'WITHDRAWN';
    }).length;

    return { total, pending };
  }, [applications]);

  const handleUpdate = async (application, nextStatus) => {
    try {
      setError('');
      const id =
        application?.id ||
        application?._id ||
        application?.applicationId ||
        application?.applicationID;
      if (!id) throw new Error('Missing application ID');

      await updateApplicationStatus(id, nextStatus);
      setApplications((prev) =>
        prev.map((a) => (String(a?.id || a?._id || a?.applicationId) === String(id) ? { ...a, status: nextStatus } : a))
      );
    } catch (e) {
      setError(e?.message || 'Status update failed');
    }
  };

  const openNotes = (application) => {
      const id =
    application?.id ||
    application?._id ||
    application?.applicationId ||
    application?.applicationID;
      setNoteApplicationId(id);
      setNotesValue('');
      setNoteOpen(true);
  };

  const submitNotes = async () => {
    if (!noteApplicationId) return;
    try {
      setNoteLoading(true);
      setError('');
      await addApplicationNote(noteApplicationId, notesValue);
      setNoteOpen(false);
    } catch (e) {
      setError(e?.message || 'Failed to add notes');
    } finally {
      setNoteLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100">
     

      <div className="container py-5" style={{ paddingTop: 30 }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h3 className="fw-bold" style={{ color: '#00796b' }}>
              Officer - Applications
            </h3>
            <p className="text-muted mb-0">Update candidate application status and add review notes.</p>
          </div>
          <span className="badge bg-warning text-dark p-2">
            <i className="fas fa-clock me-1" /> {stats.pending} Pending
          </span>
        </div>

        {error ? (
          <div className="alert alert-danger py-2 small d-flex align-items-center shadow-sm mb-3">
            <i className="fas fa-exclamation-triangle me-2" />
            <span>{error}</span>
          </div>
        ) : null}

        <div className="row g-3">
          <div className="col-md-6">
            <DashboardStatCard icon="fa-inbox" label="Total Applications" value={`${stats.total}`} helper="All candidates" />
          </div>
          <div className="col-md-6">
            <DashboardStatCard icon="fa-clock" label="Pending Reviews" value={`${stats.pending}`} helper="Awaiting officer decision" />
          </div>
        </div>

        <div className="card border-0 shadow-sm p-4 mt-4 bg-white">
          <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
            <h5 className="fw-bold" style={{ color: '#00796b' }}>
              <i className="fas fa-table me-2" /> Application Handling
            </h5>
            <div className="text-muted small">Update status, or add notes for your internal review.</div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" />
            </div>
          ) : applications.length === 0 ? (
            <EmptyState title="No applications" description="Candidates will appear here when they apply." icon="fa-briefcase" />
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr className="bg-light">
                    <th className="ps-4">Application ID</th>
                    <th>Candidate</th>
                    <th>Job</th>
                    <th>Employer</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => {
                    const id = app?.id || app?._id || app?.applicationId || app?.applicationID;
                    const status = String(app?.status || '').toUpperCase();

                    return (
                      <tr key={id || JSON.stringify(app)} className="hover:bg-gray-50">
                        <td className="ps-4">
                          <div className="fw-semibold">#{app?.applicationID ?? id ?? '-'}</div>
                        </td>
                        <td>
                          <div className="fw-semibold small">Seeker #{app?.seekerID || '-'}</div>
                        </td>
                        <td>
                          <div className="small">{app?.jobTitle || '-'}</div>
                          <div className="text-muted" style={{ fontSize: '0.72rem' }}>Job #{app?.jobID || '-'}</div>
                        </td>
                        <td>
                          <div className="small">{app?.employerName || '-'}</div>
                        </td>
                        <td>
                          <div className="small text-muted">{app?.submittedDate ? new Date(app.submittedDate).toLocaleDateString() : '-'}</div>
                        </td>
                        <td>
                          <STATUS_BADGE status={app?.status} />
                        </td>
                        <td className="text-end pe-4">
                          <div className="d-flex flex-column gap-2" style={{ minWidth: 320, marginLeft: 'auto' }}>
                            {status === 'SUBMITTED' ? (
                              <>
                                <div className="d-flex gap-2 justify-content-end">
                                  <button
                                    className="btn btn-jade btn-sm text-white"
                                    style={{ backgroundColor: '#00796b' }}
                                    onClick={() => handleUpdate(app, 'APPROVED')}
                                    disabled={status === 'APPROVED'}
                                  >
                                    Approve
                                  </button>

                                </div>

                                <div className="d-flex gap-2 justify-content-end">
                                  <button
                                    className="btn btn-jade btn-sm text-white"
                                    style={{ backgroundColor: '#ff1717ff', borderColor: '#151414ff' }}
                                    onClick={() => handleUpdate(app, 'REJECTED')}
                                    disabled={status === 'REJECTED'}
                                  >
                                    Reject
                                  </button>
                                 
                                </div>
                              </>
                            ) : null}

                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfficerApplications;

