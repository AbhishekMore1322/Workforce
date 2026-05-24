import React, { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getRole } from '../../utils/tokenStorage';

import DashboardHeader from '../../components/DashboardHeader';
import DashboardFooter from '../../components/DashboardFooter';
import DashboardStatCard from '../jobSeeker/components/DashboardStatCard';

import { getAllPlacements, updatePlacementStatus } from '../../api/officerApi';

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
        <i className={`fas ${icon || 'fa-handshake'} fa-3x`} />
      </div>
      <h4 className="fw-bold mb-2">{title}</h4>
      <p className="text-muted mb-0">{description}</p>
    </div>
  );
};

const OfficerPlacements = () => {
  const role = getRole();
  if (role !== 'OFFICER') return <Navigate to="/login" replace />;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [placements, setPlacements] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getAllPlacements();
        setPlacements(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e?.message || 'Failed to load placements');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats = useMemo(() => {
    const total = placements.length;
    const pending = placements.filter((p) => {
      const st = String(p?.status || '').toUpperCase();
      return st !== 'CONFIRMED';
    }).length;
    return { total, pending };
  }, [placements]);


  const handleUpdate = async (placement, nextStatus) => {
    try {
      setError('');
      const id = placement?.placementID;
      if (!id) throw new Error('Missing placement ID');

      await updatePlacementStatus(id, nextStatus);
      setPlacements((prev) =>
        prev.map((p) => (String(p?.placementID) === String(id) ? { ...p, status: nextStatus } : p))
      );
    } catch (e) {
      setError(e?.message || 'Placement status update failed');
    }
  };

  return (
    <div className="bg-light min-vh-100">
   

      <div className="container py-5" style={{ paddingTop: 30 }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h3 className="fw-bold" style={{ color: '#00796b' }}>
              Officer - Placements
            </h3>
            <p className="text-muted mb-0">Final tracking and placement status updates.</p>
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
            <DashboardStatCard icon="fa-handshake" label="Total Placements" value={`${stats.total}`} helper="All tracking records" />
          </div>
          <div className="col-md-6">
            <DashboardStatCard icon="fa-clock" label="Pending Reviews" value={`${stats.pending}`} helper="Awaiting final status" />
          </div>
        </div>

        <div className="card border-0 shadow-sm p-4 mt-4 bg-white">
          <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
            <h5 className="fw-bold" style={{ color: '#00796b' }}>
              <i className="fas fa-table me-2" /> Placement Tracking
            </h5>
            <div className="text-muted small">Update placement outcomes using status controls.</div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" />
            </div>
          ) : placements.length === 0 ? (
            <EmptyState title="No placements" description="Placement records will appear here when candidates are selected." icon="fa-building" />
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr className="bg-light">
                    <th className="ps-4">Placement ID</th>
                    <th>Application</th>
                    <th>Position</th>
                    <th>Employer</th>
                    <th>Start Date</th>
                    <th>Status</th>
                    <th className="text-end pe-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {placements.map((p) => {
                    const id = p?.placementID;
                    const status = String(p?.status || '').toUpperCase();
                    return (
                      <tr key={id || JSON.stringify(p)} className="hover:bg-gray-50">
                        <td className="ps-4">
                          <div className="fw-semibold">#{p?.placementID || '-'}</div>
                        </td>
                        <td>
                          <div className="small fw-semibold">App #{p?.applicationID || '-'}</div>
                        </td>
                        <td>
                          <div className="small">{p?.position || '-'}</div>
                        </td>
                        <td>
                          <div className="small text-muted">Employer #{p?.employerID || '-'}</div>
                        </td>
                        <td>{p?.startDate ? new Date(p.startDate).toLocaleDateString() : '-'}</td>
                        <td>
                          <STATUS_BADGE status={p?.status} />
                        </td>
                        <td className="text-end pe-4">
                          <div className="d-flex gap-2 justify-content-end" style={{ minWidth: 250, marginLeft: 'auto' }}>
                            <button
                              className="btn btn-jade btn-sm text-white"
                              style={{ backgroundColor: '#00796b' }}
                              onClick={() => handleUpdate(p, 'CONFIRMED')}
                              disabled={status === 'CONFIRMED'}
                            >
                              Mark Confirmed
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleUpdate(p, 'CANCELLED')}
                              disabled={status === 'CANCELLED'}
                            >
                              Cancel
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

     
    </div>
  );
};

export default OfficerPlacements;

