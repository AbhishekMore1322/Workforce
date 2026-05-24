import React, { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getRole } from '../../utils/tokenStorage';
import DashboardStatCard from '../jobSeeker/components/DashboardStatCard';
import { getAllJobSeekers, updateJobSeekerStatus } from '../../api/officerApi';
import { getJobSeekerDocuments } from '../../api/adminApi';

const STATUS_BADGE = ({ status }) => {
  const s = String(status || '').toUpperCase();
  let cls = 'bg-secondary';
  if (s === 'ACTIVE' || s === 'APPROVED') cls = 'bg-success';
  if (s === 'INACTIVE' || s === 'REJECTED') cls = 'bg-danger';
  if (s.includes('PEND')) cls = 'bg-warning text-dark';
  return <span className={`badge ${cls} me-1`}>{s || '—'}</span>;
};

const EmptyState = ({ title, description, icon }) => (
  <div className="text-center py-5">
    <div className="text-muted mb-3"><i className={`fas ${icon || 'fa-inbox'} fa-3x`} /></div>
    <h4 className="fw-bold mb-2">{title}</h4>
    <p className="text-muted mb-0">{description}</p>
  </div>
);

const OfficerJobSeekers = () => {
  const role = getRole();
  if (role !== 'OFFICER') return <Navigate to="/login" replace />;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [seekers, setSeekers] = useState([]);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [docData, setDocData] = useState([]);
  const [selectedSeeker, setSelectedSeeker] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getAllJobSeekers();
        setSeekers(
          Array.isArray(data) ? data
            : Array.isArray(data?.jobSeekers) ? data.jobSeekers
            : Array.isArray(data?.data) ? data.data
            : []
        );
      } catch (e) {
        setError(e?.message || 'Failed to load job seekers');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = useMemo(() => ({
    total: seekers.length,
    active: seekers.filter(s => String(s?.status || '').toUpperCase() === 'ACTIVE').length,
  }), [seekers]);

  const handleActivate = async (seeker) => {
    try {
      setError('');
      const id = seeker?.seekerID || seeker?.id;
      if (!id) throw new Error('Missing seeker ID');
      await updateJobSeekerStatus(id, 'ACTIVE');
      setSeekers(prev => prev.map(s =>
        (s.seekerID === id || s.id === id) ? { ...s, status: 'ACTIVE' } : s
      ));
    } catch (e) {
      setError(e?.message || 'Failed to update status');
    }
  };

  const openDocuments = async (seeker) => {
    setSelectedSeeker(seeker);
    setDocModalOpen(true);

    try {
      setDocData([]);
      const id = seeker?.seekerID || seeker?.id;
      if (!id) throw new Error('Missing seeker ID');

      const res = await getJobSeekerDocuments(id);
      const docs = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
      setDocData(docs);
    } catch (e) {
      setDocData([]);
      setError(e?.message || 'Failed to load documents');
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-5" style={{ paddingTop: 30 }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h3 className="fw-bold" style={{ color: '#00796b' }}>Officer — Job Seekers</h3>
            <p className="text-muted mb-0">Activate candidates and view their uploaded documents.</p>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small d-flex align-items-center shadow-sm mb-3">
            <i className="fas fa-exclamation-triangle me-2" /><span>{error}</span>
          </div>
        )}

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <DashboardStatCard icon="fa-users" label="Total Seekers" value={`${stats.total}`} helper="All candidates" />
          </div>
          <div className="col-md-6">
            <DashboardStatCard icon="fa-user-check" label="Active" value={`${stats.active}`} helper="Currently active" />
          </div>
        </div>

        <div className="card border-0 shadow-sm p-4 bg-white">
          <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
            <h5 className="fw-bold" style={{ color: '#00796b' }}>
              <i className="fas fa-table me-2" />Job Seeker Management
            </h5>
            <div className="text-muted small">Activate candidates and review their documents.</div>
          </div>

          {loading ? (
            <div className="text-center py-5"><div className="spinner-border" /></div>
          ) : seekers.length === 0 ? (
            <EmptyState title="No job seekers" description="Candidates will appear here as they register." icon="fa-user-check" />
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr className="bg-light">
                    <th className="ps-4">Name</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Date of Birth</th>
                    <th className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {seekers.map((seeker) => {
                    const status = String(seeker?.status || '').toUpperCase();
                    const id = seeker?.seekerID || seeker?.id;
                    return (
                      <tr key={id || JSON.stringify(seeker)}>
                        <td className="ps-4"><div className="fw-semibold">{seeker?.name || '-'}</div></td>
                        <td>{seeker?.contactInfo || seeker?.email || '-'}</td>
                        <td><STATUS_BADGE status={seeker?.status} /></td>
                        <td>{seeker?.dob ? new Date(seeker.dob).toLocaleDateString() : '-'}</td>
                        <td className="text-end pe-4">
                          <div className="d-flex gap-2 justify-content-end">
                            {status !== 'ACTIVE' && (
                              <button
                                className="btn btn-sm text-white"
                                style={{ backgroundColor: '#00796b' }}
                                onClick={() => handleActivate(seeker)}
                              >
                                Activate
                              </button>
                            )}
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => openDocuments(seeker)}
                            >
                              <i className="fas fa-file-alt me-1" />View Documents
                            </button>
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

      {docModalOpen && (
        <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  <i className="fas fa-file-alt me-2" style={{ color: '#00796b' }} />
                  Documents — {selectedSeeker?.name || 'Job Seeker'}
                </h5>
                <button className="btn-close" onClick={() => setDocModalOpen(false)} />
              </div>
              <div className="modal-body">
                {docData.length === 0 ? (
                  <EmptyState title="No documents" description="This seeker has not uploaded any documents yet." icon="fa-file-alt" />
                ) : (
                  <div className="row g-3">
                    {docData.map((doc, idx) => {
                      const docId = doc?.documentID || doc?.docId || doc?.id;
                      return (
                        <div key={docId || idx} className="col-md-6">
                          <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                              <h6 className="fw-bold mb-2">{doc?.docType || doc?.type || 'Document'}</h6>
                              <div className="text-muted small mb-2">
                                Uploaded: {doc?.uploadedDate ? new Date(doc.uploadedDate).toLocaleDateString() : '-'}
                              </div>
                              {doc?.fileURI ? (
                                <a href={doc.fileURI} target="_blank" rel="noopener noreferrer"
                                  className="btn btn-outline-primary btn-sm">
                                  <i className="fas fa-external-link-alt me-1" />View File
                                </a>
                              ) : (
                                <span className="text-muted small">No file available</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setDocModalOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficerJobSeekers;
