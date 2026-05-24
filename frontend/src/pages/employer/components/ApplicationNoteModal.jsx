import React, { useEffect, useState } from 'react';

const MIN_LENGTH = 5;
const MAX_LENGTH = 500;

const ApplicationNoteModal = ({
  open,
  onClose,
  onSave,
  loading = false,
  error,
}) => {
  const [notes, setNotes] = useState('');
  useEffect(() => {
    if (open) {
      setNotes('');
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  if (!open) return null;

  const isInvalid =
    notes.trim().length < MIN_LENGTH ||
    notes.trim().length > MAX_LENGTH;

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
            <h5 className="modal-title">Add application note</h5>
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

            <label className="form-label">Notes</label>
            <textarea
              className="form-control"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write a short note for this application..."
              maxLength={MAX_LENGTH}
            />

            <div className="small text-muted mt-1">
              {notes.length}/{MAX_LENGTH} characters
            </div>
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
              onClick={() => onSave(notes.trim())}
              disabled={loading || isInvalid}
              title={
                isInvalid
                  ? `Notes must be between ${MIN_LENGTH} and ${MAX_LENGTH} characters`
                  : 'Save note'
              }
            >
              {loading ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationNoteModal;
