import React, { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';

import DashboardHeader from '../../components/DashboardHeader';
import DashboardFooter from '../../components/DashboardFooter';

import { getRole } from '../../utils/tokenStorage';
import {
  getComplianceReports,
} from '../../api/officerApi';

const STATUS_BADGE = ({ status }) => {
  const s = String(status || '').toUpperCase();
  let cls = 'bg-secondary';
  if (s.includes('PASS') || s.includes('APPROVED') || s.includes('VERIFIED') || s.includes('COMPLIANT')) cls = 'bg-success';
  else if (s.includes('FAIL') || s.includes('REJECT') || s.includes('NON') || s.includes('NON_COMPLIANT')) cls = 'bg-danger';
  else if (s.includes('PEND') || s.includes('REVIEW')) cls = 'bg-warning text-dark';

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
        <i className={`fas ${icon || 'fa-clipboard-check'} fa-3x`} />
      </div>
      <h4 className="fw-bold mb-2">{title}</h4>
      <p className="text-muted mb-0">{description}</p>
    </div>
  );
};

const OfficerComplianceReports = ({ onCheckCompliance }) => {
  const role = getRole();
  if (role !== 'OFFICER') return <Navigate to="/login" replace />;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reports, setReports] = useState([]);

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getComplianceReports();
      setReports(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message || 'Failed to load compliance reports');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const total = reports.length;
    const compliant = reports.filter((r) => String(r?.result || '').toUpperCase().includes('PASS') || String(r?.result || '').toUpperCase().includes('COMPLIANT')).length;
    return { total, compliant };
  }, [reports]);

  return (
    <div className="bg-light min-vh-100">
      

      <div className="container py-5" style={{ paddingTop: 30 }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h3 className="fw-bold" style={{ color: '#00796b' }}>
              Officer - Compliance Reports
            </h3>
            <p className="text-muted mb-0">Historical compliance checks and officer outcomes.</p>
          </div>

          <button
            className="btn btn-outline-secondary"
            onClick={load}
            disabled={loading}
            style={{ borderRadius: 14 }}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {error ? (
          <div className="alert alert-danger py-2 small d-flex align-items-center shadow-sm mb-3">
            <i className="fas fa-exclamation-triangle me-2" />
            <span>{error}</span>
          </div>
        ) : null}

        <div className="row g-3">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm p-4 h-100 bg-white">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-muted small">Total Records</div>
                  <div className="fw-bold" style={{ color: '#00796b', fontSize: 24 }}>{stats.total}</div>
                </div>
                <i className="fas fa-clipboard-list" style={{ color: '#00796b', fontSize: 28 }} />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card border-0 shadow-sm p-4 h-100 bg-white">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-muted small">Compliant</div>
                  <div className="fw-bold" style={{ color: '#00796b', fontSize: 24 }}>{stats.compliant}</div>
                </div>
                <i className="fas fa-shield-check" style={{ color: '#00796b', fontSize: 28 }} />
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm p-4 mt-4 bg-white">
          <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
            <h5 className="fw-bold" style={{ color: '#00796b' }}>
              <i className="fas fa-table me-2" /> Compliance Records
            </h5>
            <div className="text-muted small">Use “Check Compliance” from candidate/company tables.</div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" />
            </div>
          ) : reports.length === 0 ? (
            <EmptyState title="No compliance records" description="Compliance checks will appear here once officers submit them." icon="fa-shield-alt" />
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr className="bg-light">
                    <th className="ps-4">ID</th>
                    <th>Entity Type</th>
                    <th>Entity ID</th>
                    <th>Result</th>
                    <th>Date</th>
                    <th className="pe-4 text-end">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => {
                    const id = r?.complianceID ?? r?.id ?? r?._id;
                    return (
                      <tr key={id || JSON.stringify(r)} className="hover:bg-gray-50">
                        <td className="ps-4">{id ?? '-'}</td>
                        <td>{r?.type || r?.entityType || '-'}</td>
                        <td>{r?.entityID ?? '-'}</td>
                        <td>
                          <STATUS_BADGE status={r?.result} />
                        </td>
                        <td>
                          {r?.date ? new Date(r.date).toLocaleDateString() : '-'}
                        </td>
                        <td className="pe-4 text-end text-muted">
                          {r?.notes ? r.notes : '-'}
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

export default OfficerComplianceReports;

