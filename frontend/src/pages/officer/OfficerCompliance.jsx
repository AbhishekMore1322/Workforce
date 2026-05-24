import React, { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { getRole } from '../../utils/tokenStorage';

import { getComplianceReports, postComplianceCheck } from '../../api/officerApi';

const STATUS_BADGE = ({ result }) => {
  const s = String(result || '').toUpperCase();

  const isSuccess =
    s.includes('PASS') ||
    s.includes('APPROVED') ||
    s.includes('VERIFIED') ||
    s.includes('COMPLIANT') ||
    s.includes('SUCCESS');

  const isFailure =
    s.includes('FAIL') ||
    s.includes('REJECT') ||
    s.includes('NON') ||
    s.includes('NON_COMPLIANT') ||
    s.includes('FAILURE');

  const cls = isSuccess ? 'bg-success' : isFailure ? 'bg-danger' : 'bg-secondary';
  return <span className={`badge ${cls} me-1`}>{s || '—'}</span>;
};

const EmptyState = ({ title, description, icon }) => {
  return (
    <div className="text-center py-5">
      <div className="text-muted mb-3">
        <i className={`fas ${icon || 'fa-shield-alt'} fa-3x`} />
      </div>
      <h4 className="fw-bold mb-2">{title}</h4>
      <p className="text-muted mb-0">{description}</p>
    </div>
  );
};

const OfficerCompliance = () => {
  const role = getRole();
  if (role !== 'OFFICER') return <Navigate to="/login" replace />;


  const [entityType, setEntityType] = useState('APPLICATION');
  const [entityID, setEntityID] = useState('');
  const [result, setResult] = useState('COMPLIANT');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');


  const [loadingReports, setLoadingReports] = useState(true);
  const [reports, setReports] = useState([]);

  const refreshReports = async () => {
    setLoadingReports(true);
    setError('');
    try {
      const data = await getComplianceReports();
      setReports(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message || 'Failed to load compliance reports');
      setReports([]);
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    refreshReports();
    
  }, []);

  const stats = useMemo(() => {
    const total = reports.length;
    const compliant = reports.filter((r) => {
      const s = String(r?.result || '').toUpperCase();
      return s === 'COMPLIANT';
    }).length;
    return { total, compliant };
  }, [reports]);

  const onRunCheck = async () => {
    try {
      setSubmitting(true);
      setError('');

      const parsedEntityID = Number(entityID);
      if (!Number.isFinite(parsedEntityID)) throw new Error('Entity ID must be a number');
      if (!String(notes || '').trim()) throw new Error('Compliance Notes are required');

      const type = String(entityType).toUpperCase();
      const complianceResult = String(result).toUpperCase();

      await postComplianceCheck({
        entityID: parsedEntityID,
        type,
        result: complianceResult,
        notes,
      });

      setNotes('');
      setEntityID('');
      setResult('COMPLIANT');

      await refreshReports();
    } catch (e) {
      setError(e?.message || 'Failed to submit compliance check');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-5" style={{ paddingTop: 30 }}>
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
          <div>
            <h3 className="fw-bold" style={{ color: '#00796b' }}>
              Officer - Compliance Management
            </h3>
            <p className="text-muted mb-0">Create compliance checks and review history.</p>
          </div>
          <span className="badge bg-warning text-dark p-2">
            <i className="fas fa-shield-alt me-1" /> {stats.compliant} Compliant
          </span>
        </div>

        {error ? (
          <div className="alert alert-danger py-2 small d-flex align-items-center shadow-sm mb-3">
            <i className="fas fa-exclamation-triangle me-2" />
            <span>{error}</span>
          </div>
        ) : null}

   
        <div className="card border-0 shadow-sm p-4 bg-white mb-4">
          <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
            <h5 className="fw-bold" style={{ color: '#00796b' }}>
              <i className="fas fa-plus-circle me-2" /> Create Compliance Check
            </h5>
            <div className="text-muted small">Run an officer compliance verification for an entity.</div>
          </div>

          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Entity Type</label>
              <select
                className="form-select"
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
                disabled={submitting}
              >
                <option value="APPLICATION">Application</option>
                <option value="PLACEMENT">Placement</option>
                <option value="PROGRAM">Program</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Entity ID</label>
              <input
                className="form-control"
                type="number"
                value={entityID}
                onChange={(e) => setEntityID(e.target.value)}
                placeholder="Enter numeric entityID"
                disabled={submitting}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Compliance Result</label>
              <select
                className="form-select"
                value={result}
                onChange={(e) => setResult(e.target.value)}
                disabled={submitting}
              >
                <option value="COMPLIANT">COMPLIANT</option>
                <option value="NON_COMPLIANT">NON_COMPLIANT</option>
              </select>
            </div>

            <div className="col-md-3 d-flex align-items-end">
              <button
                className="btn btn-jade text-white w-100"
                style={{ backgroundColor: '#00796b' }}
                onClick={onRunCheck}
                disabled={submitting}
              >
                {submitting ? 'Running...' : 'Run Check'}
              </button>
            </div>

            <div className="col-12">
              <label className="form-label">Notes</label>
              <textarea
                className="form-control"
                rows={5}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write compliance check notes..."
                required
                disabled={submitting}
              />
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm p-4 bg-white">
          <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom flex-wrap gap-2">
            <h5 className="fw-bold" style={{ color: '#00796b' }}>
              <i className="fas fa-table me-2" /> Compliance Reports
            </h5>
            <div className="text-muted small">Total records: {stats.total}</div>
          </div>

          {loadingReports ? (
            <div className="text-center py-5">
              <div className="spinner-border" />
            </div>
          ) : reports.length === 0 ? (
            <EmptyState
              title="No compliance records"
              description="Compliance checks will appear here after you run them."
              icon="fa-shield-alt"
            />
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
                          <STATUS_BADGE result={r?.result} />
                        </td>
                        <td>{r?.date ? new Date(r.date).toLocaleDateString() : '-'}</td>
                        <td className="pe-4 text-end text-muted">{r?.notes ? r.notes : '-'}</td>
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

export default OfficerCompliance;

