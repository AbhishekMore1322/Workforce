import React, { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { getRole } from '../../utils/tokenStorage';

import DashboardHeader from '../../components/DashboardHeader';
import DashboardFooter from '../../components/DashboardFooter';

import { getAllEmployers, updateEmployerStatus } from '../../api/officerApi';
import DashboardStatCard from '../jobSeeker/components/DashboardStatCard';

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
        <i className={`fas ${icon || 'fa-building'} fa-3x`} />
      </div>
      <h4 className="fw-bold mb-2">{title}</h4>
      <p className="text-muted mb-0">{description}</p>
    </div>
  );
};

const OfficerEmployers = () => {
  const role = getRole();
  if (role !== 'OFFICER') return <Navigate to="/login" replace />;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [employers, setEmployers] = useState([]);
  const [rawResponse, setRawResponse] = useState(null);



  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getAllEmployers();
        setRawResponse(data);
        console.log('getAllEmployers raw:', data);
        const normalized = Array.isArray(data)
          ? data
          : Array.isArray(data?.employers)
            ? data.employers
            : Array.isArray(data?.data)
              ? data.data
              : [];

        setEmployers(normalized);
      } catch (e) {
        setError(e?.message || 'Failed to load employers');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);


const stats = useMemo(() => {
  const total = employers.length;

  const pending = employers.filter((e) => {
    const st = String(e?.status || '').toUpperCase();
    return st !== 'APPROVED';
  }).length;


  const active = employers.filter((e) => {
    const st = String(e?.status || '').toUpperCase();
    return st === 'ACTIVE' || st === 'APPROVED';
  }).length;

  return { total, pending, active };
}, [employers]);

  const handleToggle = async (employer, nextStatus) => {
    try {
      setError('');
      const id = employer?.employerID || employer?.id || employer?._id;
      if (!id) throw new Error('Missing employer ID');

      await updateEmployerStatus(id, nextStatus);
      setEmployers((prev) =>
        prev.map((e) => (e.employerID === id || e.id === id || e._id === id ? { ...e, status: nextStatus } : e))
      );
    } catch (e) {
      setError(e?.message || 'Failed to update status');
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-5" style={{ paddingTop: 30 }}>

        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h3 className="fw-bold" style={{ color: '#00796b' }}>
              Officer - Employers
            </h3>
            <p className="text-muted mb-0">Activate/deactivate employers and manage account status.</p>
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
          <div className="col-md-3">
            <DashboardStatCard icon="fa-building" label="Total Employers" value={`${stats.total}`} helper="All companies" />
          </div>
          <div className="col-md-3">
            <DashboardStatCard icon="fa-clock" label="Pending Reviews" value={`${stats.pending}`} helper="Awaiting officer action" />
          </div>
          <div className="col-md-3">
            <DashboardStatCard icon="fa-user-check" label="Active" value={`${stats.active}`} helper="Currently active" />
          </div>
          <div className="col-md-3">
            <DashboardStatCard icon="fa-shield-alt" label="Verification" value="" helper="Status controls are enabled" />
          </div>
        </div>

        <div className="card border-0 shadow-sm p-4 mt-4 bg-white">
          <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
            <h5 className="fw-bold" style={{ color: '#00796b' }}>
              <i className="fas fa-table me-2" /> Employer Management
            </h5>
            <div className="text-muted small">Use Activate/Deactivate to update onboarding state.</div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" />
            </div>
          ) : employers.length === 0 ? (
            <EmptyState title="No employers" description="Employers will appear here as they register." icon="fa-briefcase" />
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr className="bg-light">
                    <th className="ps-4">Company</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employers.map((employer) => {
                    const status = String(employer?.status || '').toUpperCase();
                    const id = employer?.employerID || employer?.id || employer?._id;
                    return (
                      <tr key={id || JSON.stringify(employer)} className="hover:bg-gray-50">
                        <td className="ps-4">
                          <div className="fw-semibold">{employer?.name || employer?.companyName || '-'}</div>
                        </td>
                        <td>{employer?.contactInfo || employer?.email || '-'}</td>
                        <td>
                          <STATUS_BADGE status={employer?.status} />
                        </td>
                        <td className="text-end pe-4">
                          <div className="d-flex flex-column gap-2" style={{ minWidth: 220, marginLeft: 'auto' }}>
                            {status !== 'ACTIVE' && (
                              <button
                                className="btn btn-jade btn-sm text-white"
                                style={{ backgroundColor: '#00796b' }}
                                onClick={() => handleToggle(employer, 'APPROVED')}
                              >
                                Approve
                              </button>
                            )}
                            {status !== 'INACTIVE' && (
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleToggle(employer, 'INACTIVE')}
                              >
                                Deactivate
                              </button>
                            )}


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

export default OfficerEmployers;

