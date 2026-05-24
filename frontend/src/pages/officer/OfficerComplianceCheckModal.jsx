import React, { useMemo, useState } from 'react';
import { addApplicationNote } from '../../api/officerApi';

const STATUS_BADGE = ({ status }) => {
  const s = String(status || '').toUpperCase();
  let cls = 'bg-secondary';
  if (s.includes('PASS') || s.includes('APPROVED') || s.includes('VERIFIED') || s.includes('COMPLIANT')) cls = 'bg-success';
  else if (s.includes('FAIL') || s.includes('REJECT') || s.includes('NON')) cls = 'bg-danger';
  else if (s.includes('PEND') || s.includes('REVIEW')) cls = 'bg-warning text-dark';
  return <span className={`badge ${cls} me-1`}>{s || '—'}</span>;
};

const OfficerComplianceCheckModal = ({
  isOpen,
  onClose,
  entityType,
  entityID,
  onSubmit,
  submitting,
  error,
}) => {
  const [notes, setNotes] = useState('');

  const modalTitle = useMemo(() => {
    const t = String(entityType || '').toUpperCase();
    return `Check Compliance - ${t || 'ENTITY'}`;
  }, [entityType]);

  if (!isOpen) return null;

  const submit = async () => {
    await onSubmit({ notes });
  };

  return (
    <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.4)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5>{modalTitle}</h5>
            <button className="btn-close" onClick={onClose} disabled={submitting} />
          </div>

          <div className="modal-body">
            {error ? (
              <div className="alert alert-danger py-2 small d-flex align-items-center shadow-sm mb-3">
                <i className="fas fa-exclamation-triangle me-2" />
                <span>{error}</span>
              </div>
            ) : null}

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">Entity Type</label>
                <div className="form-control bg-light">
                  {entityType || '-'}
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label">Entity ID</label>
                <div className="form-control bg-light">
                  {entityID ?? '-'}
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Compliance Notes</label>
              <textarea
                className="form-control"
                rows={5}
                required
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write compliance check notes..."
                disabled={submitting}
              />
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-outline-secondary" onClick={onClose} disabled={submitting}>
                Cancel
              </button>
              <button
                className="btn btn-jade text-white"
                style={{ backgroundColor: '#00796b' }}
                onClick={submit}
                disabled={submitting || !notes.trim()}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerComplianceCheckModal;

