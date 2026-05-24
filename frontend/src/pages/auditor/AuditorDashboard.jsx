import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DashboardHeader from '../../components/DashboardHeader';
import DashboardFooter from '../../components/DashboardFooter';

import {
  createAudit,
  getAllAudits,
  getJobApplicationAnalytics,
  getTrainingAnalytics,
  getPlacementAnalytics,
  getComplianceAnalytics,
} from '../../api/auditorApi';

import ReportsOverview from './components/ReportsOverview';
import AuditList from './components/AuditList';
import CreateAuditModal from './components/CreateAuditModal';

const AuditorDashboard = () => {
  const [reportsLoading, setReportsLoading] = useState(false);
  const [auditsLoading, setAuditsLoading] = useState(false);

  const [reports, setReports] = useState({
    jobApplications: null,
    training: null,
    placements: null,
    compliance: null,
  });

  const [audits, setAudits] = useState([]);
  const [error, setError] = useState('');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalScope, setModalScope] = useState('APPLICATION');
  const [isSubmittingAudit, setIsSubmittingAudit] = useState(false);

  const canShowReports = useMemo(() => {
    return !reportsLoading;
  }, [reportsLoading]);

  const fetchReports = useCallback(async () => {
    setReportsLoading(true);
    setError('');
    try {
      const [jobApps, training, placements, compliance] = await Promise.all([
        getJobApplicationAnalytics(),
        getTrainingAnalytics(),
        getPlacementAnalytics(),
        getComplianceAnalytics(),
      ]);

      setReports({
        jobApplications: jobApps,
        training,
        placements,
        compliance,
      });
    } catch (e) {
      setError(e?.message || 'Failed to load reports.');
    } finally {
      setReportsLoading(false);
    }
  }, []);

  const fetchAudits = useCallback(async () => {
    setAuditsLoading(true);
    setError('');
    try {
      const res = await getAllAudits();
      setAudits(Array.isArray(res) ? res : res?.audits || []);
    } catch (e) {
      setError(e?.message || 'Failed to load audits.');
    } finally {
      setAuditsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
    fetchAudits();
  }, [fetchReports, fetchAudits]);

  const handleCreateAuditFromReport = useCallback((scope) => {
    setModalScope(scope);
    setShowCreateModal(true);
  }, []);

  const handleSubmitAudit = useCallback(
    async ({ scope, findings }) => {
      setIsSubmittingAudit(true);
      setError('');
      try {
        await createAudit({ scope, findings });
        setShowCreateModal(false);
        await fetchAudits();
      } catch (e) {
        setError(e?.message || 'Failed to create audit.');
      } finally {
        setIsSubmittingAudit(false);
      }
    },
    [fetchAudits]
  );

  return (
    <div className="container-fluid bg-light min-vh-100">
      <DashboardHeader />

      <div className="container py-5">
        {/* Section 1: Header / Context */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex align-items-center">
              <div className="p-3 rounded-circle bg-light me-3">
                <i className="fas fa-file-shield fa-2x" style={{ color: '#00796b' }}></i>
              </div>
              <div>
                <h3 className="fw-bold mb-0" style={{ color: '#00796b' }}>
                  Auditor Dashboard
                </h3>
                <p className="text-muted mb-0">Review system reports and record compliance audit findings.</p>
              </div>
            </div>

            <div className="mt-3 alert alert-light border border-1 border-0 shadow-sm" style={{ background: '#ffffff' }}>
              <div className="d-flex align-items-start">
                <i className="fas fa-info-circle me-2" style={{ color: '#00796b', marginTop: 2 }}></i>
                <div>
                  <div className="fw-semibold">Audits must be created based on report analysis.</div>
                  <div className="small text-muted">
                    Reports provide evidence. Audits are recorded conclusions.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error ? (
          <div className="row mb-3">
            <div className="col-12">
              <div className="alert alert-danger border-0 shadow-sm">{error}</div>
            </div>
          </div>
        ) : null}

        {/* Section 2 + 3 */}
        <div className="row g-4">
          <div className="col-12">
            <div className="card workforce-card p-4 border-0 shadow-sm bg-white border-start border-4 border-dark">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <div className="d-flex align-items-center">
                    <i className="fas fa-file-alt me-2" style={{ color: '#00796b' }}></i>
                    <h5 className="fw-bold mb-0" style={{ color: '#00796b' }}>
                      System Reports (Evidence)
                    </h5>
                  </div>
                  <div className="small text-muted mt-1">Select a report to create an audit based on reviewed data.</div>
                </div>
                <button className="btn btn-sm btn-outline-dark" onClick={fetchReports} disabled={reportsLoading}>
                  {reportsLoading ? 'Loading…' : 'Refresh Reports'}
                </button>
              </div>

              <div className="mt-4">
                {canShowReports ? (
                  <ReportsOverview reports={reports} onCreateAudit={handleCreateAuditFromReport} />
                ) : (
                  <div className="text-center py-4 text-muted">Loading report evidence…</div>
                )}
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="card workforce-card p-4 border-0 shadow-sm bg-white border-start border-4 border-dark">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <div className="d-flex align-items-center">
                    <i className="fas fa-clipboard-list me-2" style={{ color: '#00796b' }}></i>
                    <h5 className="fw-bold mb-0" style={{ color: '#00796b' }}>
                      Audit Records (Conclusions)
                    </h5>
                  </div>
                  <div className="small text-muted mt-1">Existing audits created from evidence review.</div>
                </div>
                <button className="btn btn-sm btn-outline-dark" onClick={fetchAudits} disabled={auditsLoading}>
                  {auditsLoading ? 'Loading…' : 'Refresh Audits'}
                </button>
              </div>

              <div className="mt-4">
                {auditsLoading ? (
                  <div className="text-center py-4 text-muted">Loading audit records…</div>
                ) : (
                  <AuditList audits={audits} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreateAuditModal
        show={showCreateModal}
        initialScope={modalScope}
        isSubmitting={isSubmittingAudit}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleSubmitAudit}
      />

      {/* Shared Footer */}
      <DashboardFooter />
    </div>
  );
};

export default AuditorDashboard;

