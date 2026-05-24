import React, { useEffect, useState } from 'react';

const InterviewScheduleModal = ({
  open,
  onClose,
  onSave,
  loading = false,
  error,
  defaultDate,
}) => {
  const [date, setDate] = useState(defaultDate || '');
  const [time, setTime] = useState('11:00');

  useEffect(() => {
    if (open) {
      setDate(defaultDate || '');
      setTime('11:00');
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open, defaultDate]);

  if (!open) return null;

  const isInvalid = !date || !time;

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
            <h5 className="modal-title">Schedule Interview</h5>
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

            <div className="row g-3">
              <div className="col-12">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="col-12">
                <label className="form-label">Time</label>
                <input
                  type="time"
                  className="form-control"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
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
              onClick={() => onSave({ date, time })}
              disabled={loading || isInvalid}
              title={
                isInvalid
                  ? 'Please select both date and time'
                  : 'Schedule interview'
              }
            >
              {loading ? 'Scheduling...' : 'Schedule'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewScheduleModal;