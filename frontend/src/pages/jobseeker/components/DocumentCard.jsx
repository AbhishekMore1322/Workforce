import React from 'react';

const formatDate = (d) => (d ? String(d).slice(0, 10) : '-');

const DocumentCard = ({ doc, onDelete, deleting }) => {
  const docId = doc?.documentID || doc?.docId || doc?.id;
  const docType = doc?.docType || doc?.documentType || doc?.type || '-';
  const uploadedAt = doc?.uploadedDate || doc?.uploadDate || doc?.createdAt;

  return (
    <div className="col-md-6">
      <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
        <div className="card-body">
          <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
            <div>
              <h6 className="fw-bold mb-1">{docType}</h6>
              <div className="text-muted small">Uploaded: {formatDate(uploadedAt)}</div>
            </div>
            <span className="badge bg-light text-dark border" style={{ fontSize: '0.7rem' }}>
              {String(docType).replace('_', ' ')}
            </span>
          </div>

          {doc?.fileURI ? (
            <a href={doc.fileURI} target="_blank" rel="noreferrer"
              className="btn btn-outline-primary btn-sm me-2">
              <i className="bi bi-box-arrow-up-right me-1" />View
            </a>
          ) : (
            <span className="text-muted small me-2">No file link</span>
          )}

          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => onDelete && onDelete(docId)}
            disabled={deleting}
          >
            {deleting ? <span className="spinner-border spinner-border-sm" /> : <><i className="bi bi-trash me-1" />Delete</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
