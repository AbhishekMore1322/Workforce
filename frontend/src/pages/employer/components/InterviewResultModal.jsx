import React, { useEffect, useState } from 'react';
import { InterviewResult } from '../employerEnums';

const InterviewResultModal = ({
  open,
  onClose,
  onSave,
  loading = false,
  error,
  initialResult,
}) => {
  const [result, setResult] = useState(
    initialResult || InterviewResult.SHORTLISTED
  );

  useEffect(() => {
    if (open) {
      setResult(initialResult || InterviewResult.SHORTLISTED);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open, initialResult]);

  if (!open) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: 'block', background: 'rgba(0,0,0,0.4)' }}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Update Interview Result</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={loading}
            />
          </div>

          <div className="modal-body">
            {error && (
              <div className="alert alert-danger py-2 small mb-3">
                {error}
              </div>
            )}

            <label className="form-label">Result</label>
            <select
              className="form-select"
              value={result}
              onChange={(e) => setResult(e.target.value)}
            >
              <option value={InterviewResult.SHORTLISTED}>
                Shortlisted
              </option>
              <option value={InterviewResult.REJECTED}>
                Rejected
              </option>
            </select>
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-outline-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={() => onSave(result)}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Result'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewResultModal;