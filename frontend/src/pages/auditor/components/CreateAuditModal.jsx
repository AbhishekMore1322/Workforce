import React, { useEffect, useMemo, useState } from 'react';

const SCOPE_LABEL = {
  APPLICATION: 'APPLICATION',
  TRAINING: 'TRAINING',
  PLACEMENT: 'PLACEMENT',
  COMPLIANCE: 'COMPLIANCE',
};

const CreateAuditModal = ({ show, initialScope, onClose, onSubmit, isSubmitting }) => {
  const [scope, setScope] = useState(initialScope || 'APPLICATION');
  const [findings, setFindings] = useState('');

  useEffect(() => {
    if (show) {
      setScope(initialScope || 'APPLICATION');
      setFindings('');
    }
  }, [show, initialScope]);

  const canSubmit = useMemo(() => {
    return String(findings || '').trim().length > 0;
  }, [findings]);

  if (!show) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: 'block', background: 'rgba(0,0,0,0.45)' }}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog modal-lg" style={{ marginTop: '8vh' }}>
        <div className="modal-content border-0 shadow-sm">
          <div className="modal-header border-0">
            <div>
              <h5 className="modal-title fw-bold" style={{ color: '#00796b' }}>
                Create Audit
              </h5>
              <div className="small text-muted">Audits are conclusions, not blind entries.</div>
            </div>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
          </div>

          <div className="modal-body px-4">
            <div className="mb-3">
              <label className="form-label fw-semibold">Scope</label>
              <select className="form-select" value={scope} onChange={(e) => setScope(e.target.value)}>
                {Object.values(SCOPE_LABEL).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-2">
              <label className="form-label fw-semibold">Findings / Observations</label>
              <textarea
                className="form-control"
                rows={5}
                value={findings}
                onChange={(e) => setFindings(e.target.value)}
                placeholder="Describe what you observed from the reviewed report data."
              />
              <div className="form-text">
                Describe findings based on the reviewed system reports.
              </div>
            </div>
          </div>

          <div className="modal-footer border-0 px-4">
            <button className="btn btn-outline-dark" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button
              className="btn btn-dark"
              onClick={() => onSubmit({ scope, findings })}
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? 'Submitting…' : 'Submit Audit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAuditModal;

