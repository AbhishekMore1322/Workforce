import React from 'react';

const ReportCard = ({
  domain,
  icon,
  title,
  status,
  metrics,
  actionLabel,
  onAction,
}) => {
  const metricEntries = metrics && typeof metrics === 'object' ? Object.entries(metrics) : [];

  return (
    <div className="card border-0 shadow-sm bg-white">
      <div className="card-body p-4">
        <div className="d-flex align-items-start justify-content-between">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <div className="p-2 rounded" style={{ background: '#e8f5f2' }}>
                <i className={icon} style={{ color: '#00796b' }} />
              </div>
              <div>
                <h5 className="fw-bold mb-0">{title}</h5>
                <div className="small text-muted">{domain}</div>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <span
                className="me-2"
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: '#00796b',
                  display: 'inline-block',
                }}
              />
              <span className="small fw-semibold text-muted">{status}</span>
            </div>
          </div>

          {onAction ? (
            <button className="btn btn-sm btn-outline-dark" onClick={onAction}>
              {actionLabel}
            </button>
          ) : null}
        </div>

        <div className="mt-3">
          <div className="small fw-semibold text-secondary mb-2">Summary metrics</div>
          {metricEntries.length ? (
            <div className="row g-2">
              {metricEntries.slice(0, 6).map(([k, v]) => (
                <div key={k} className="col-12">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted small">{k}</span>
                    <span className="fw-semibold small text-dark">
                      {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted small">No summary metrics provided.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportCard;

