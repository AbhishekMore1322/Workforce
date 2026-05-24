import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRole } from '../../utils/tokenStorage';
import {
  getAllJobSeekers,
  updateJobSeekerStatus,
  getJobSeekerDocuments,
  getApplicationsByJobSeeker,
} from '../../api/adminApi';
import StatusBadge from './components/StatusBadge';
import AdminTable from './components/AdminTable';

const AdminJobSeekers = () => {
  const navigate = useNavigate();
  const role = getRole();

  const [jobSeekers, setJobSeekers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailMode, setDetailMode] = useState('documents');
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState([]);


  useEffect(() => {
    if (role !== 'ADMIN') {
      navigate('/login');
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getAllJobSeekers();
        setJobSeekers(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message || 'Failed to load job seekers');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [navigate, role]);
  const columns = useMemo(
    () => [
      {
        key: 'name',
        label: 'Name',
        render: (r) => r.name || '-',
      },
      {
        key: 'contact',
        label: 'Contact',
        render: (r) => r.contactInfo || '-',
      },
      {
        key: 'status',
        label: 'Status',
        render: (r) => <StatusBadge status={r.status} />,
      },
      {
        key: 'dob',
        label: 'Date of Birth',
        render: (r) =>
          r.dob ? new Date(r.dob).toLocaleDateString() : '-',
      },
    ],
    []
  );

  const fetchDetails = async (mode, seeker) => {
    if (!seeker.seekerID) {
      console.error('Missing seekerID:', seeker);
      return;
    }

    setDetailOpen(true);
    setDetailMode(mode);
    setDetailLoading(true);
    setDetailData([]);

    try {
      if (mode === 'documents') {
        const docs = await getJobSeekerDocuments(seeker.seekerID);
        setDetailData(docs || []);
      } else {
        const apps = await getApplicationsByJobSeeker(seeker.seekerID);
        setDetailData(apps || []);
      }
    } catch (e) {
      console.error(e);
      setDetailData([]);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleToggleStatus = async (seeker, nextStatus) => {
    if (!seeker.seekerID) {
      console.error('Missing seekerID:', seeker);
      return;
    }

    try {
      await updateJobSeekerStatus(seeker.seekerID, nextStatus);

      setJobSeekers((prev) =>
        prev.map((s) =>
          s.seekerID === seeker.seekerID
            ? { ...s, status: nextStatus }
            : s
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  if (role !== 'ADMIN') return null;

  return (
    <div className="p-5 bg-light min-vh-100">
      <div className="d-flex justify-content-between mb-4 pb-3 border-bottom">
        <h2 className="fw-bold">Job Seeker Management</h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" />
        </div>
      ) : (
        <AdminTable
          columns={columns}
          rows={jobSeekers}
          emptyText="No job seekers found."
          renderRowActions={(seeker) => {
            const status = (seeker.status || '').toUpperCase();

            return (
              <div className="d-flex flex-column gap-2" style={{ minWidth: 230 }}>
                {status !== 'ACTIVE' && (
                  <button
                    className="btn btn-jade btn-sm text-white"
                    style={{ backgroundColor: '#00796b' }}
                    onClick={() =>
                      handleToggleStatus(seeker, 'ACTIVE')
                    }
                  >
                    Activate
                  </button>
                )}

                {status !== 'INACTIVE' && (
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() =>
                      handleToggleStatus(seeker, 'INACTIVE')
                    }
                  >
                    Deactivate
                  </button>
                )}

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-dark btn-sm flex-fill"
                    onClick={() => fetchDetails('documents', seeker)}
                  >
                    View Documents
                  </button>
                  <button
                    className="btn btn-outline-dark btn-sm flex-fill"
                    onClick={() => fetchDetails('applications', seeker)}
                  >
                    View Applications
                  </button>
                </div>
              </div>
            );
          }}
        />
      )}
      {detailOpen && (
        <div
          className="modal show"
          style={{ display: 'block', background: 'rgba(0,0,0,0.4)' }}
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5>
                  {detailMode === 'documents'
                    ? 'Job Seeker Documents'
                    : 'Job Seeker Applications'}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setDetailOpen(false)}
                />
              </div>

              <div className="modal-body">
                {detailLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border" />
                  </div>
                ) : detailData.length === 0 ? (
                  <div className="text-center text-muted py-4">
                    No data available.
                  </div>
                ) : (
                  <div className="row g-4">
                    {detailMode === 'documents' &&
                      detailData.map((doc, index) => (
                        <div key={index} className="col-md-6">
                          <div className="card h-100 border-0 shadow-sm">
                            <div className="card-body">
                              <h6 className="fw-bold mb-3">Document</h6>

                              <div className="mb-2">
                                <strong>Type:</strong>{' '}
                                <span className="text-muted">
                                  {doc.docType || '-'}
                                </span>
                              </div>

                              <div className="mb-2">
                                <strong>Uploaded On:</strong>{' '}
                                <span className="text-muted">
                                  {doc.uploadedDate
                                    ? new Date(doc.uploadedDate).toLocaleDateString()
                                    : '-'}
                                </span>
                              </div>

                              <div className="mb-2">
                                <strong>Verification Status:</strong>{' '}
                                <StatusBadge status={doc.verificationStatus} />
                              </div>

                              <div className="mt-3">
                                {doc.fileURI ? (
                                  <a
                                    href={doc.fileURI}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline-primary btn-sm"
                                  >
                                    View Document
                                  </a>
                                ) : (
                                  <span className="text-muted small">
                                    No document file available
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                    {detailMode === 'applications' &&
                      detailData.map((app, index) => (
                        <div key={index} className="col-md-6">
                          <div className="card h-100 border-0 shadow-sm">
                            <div className="card-body">
                              <h6 className="fw-bold mb-2">Application</h6>

                              <div className="mb-1">
                                <strong>Job Title:</strong>{' '}
                                <span className="text-muted">
                                  {app.jobTitle || '-'}
                                </span>
                              </div>

                              <div className="mb-1">
                                <strong>Employer:</strong>{' '}
                                <span className="text-muted">
                                  {app.employerName || '-'}
                                </span>
                              </div>

                              <div className="mt-2">
                                <strong>Status:</strong>{' '}
                                <StatusBadge status={app.status} />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobSeekers;