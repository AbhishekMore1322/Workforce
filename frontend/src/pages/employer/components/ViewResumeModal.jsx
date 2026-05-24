import React, { useEffect } from 'react';

const ViewResumeModal = ({
  open,
  onClose,
  resumeUrl,
  loading = false,
  error,
}) => {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    return () => (document.body.style.overflow = 'auto');
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: 'block', background: 'rgba(0,0,0,0.4)' }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Latest Resume</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">

            {error && <div className="alert alert-danger">{error}</div>}

            {loading ? (
              <div>Loading resume...</div>
            ) : resumeUrl ? (
              <iframe
                title="resume"
                src={resumeUrl}
                style={{ width: '100%', height: '70vh', border: 'none' }}
              />
            ) : (
              <div>No resume found.</div>
            )}

          </div>

          <div className="modal-footer">

            <a
              href={resumeUrl || '#'}
              target="_blank"
              rel="noreferrer"
              className={`btn btn-outline-secondary ${!resumeUrl && 'disabled'}`}
            >
              Open in new tab
            </a>

            <button className="btn btn-primary" onClick={onClose}>
              Close
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ViewResumeModal;