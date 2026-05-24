import React from 'react';

const truncate = (value, max = 240) => {
  const s = value == null ? '' : String(value);
  if (s.length <= max) return s;
  return s.slice(0, max) + '…';
};

const getStatusColor = (status) => {
  const s = (status || '').toLowerCase();
  if (s.includes('pass') || s.includes('approved') || s.includes('compliant')) return '#198754';
  if (s.includes('fail') || s.includes('non') || s.includes('violation')) return '#dc3545';
  if (s.includes('pending') || s.includes('in progress')) return '#6c757d';
  return '#00796b';
};

const AuditCard = ({ audit }) => {
  const scope = audit?.scope || '-';
  const findings = audit?.findings || audit?.observations || audit?.observation || '';
  const createdAt = audit?.createdAt || audit?.created_at || audit?.timestamp || '';
  const complianceStatus = audit?.complianceStatus || audit?.compliance_status || audit?.status || '';

  return (
    <div className="card border-0 shadow-sm bg-white">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start gap-3">
          <div>
            <div className="small text-muted">Audit ID</div>
            <div className="fw-bold">{audit?._id || audit?.id || '-'}</div>

            <div className="mt-3">
              <div className="small text-muted">Scope</div>
              <div className="fw-semibold">{scope}</div>
            </div>
          </div>

          <div className="text-end">
            <div className="small text-muted">Compliance</div>
            <div className="d-flex align-items-center justify-content-end gap-2">
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: getStatusColor(complianceStatus),
                  display: 'inline-block',
                }}
              />
              <span className="small fw-semibold" style={{ color: '#333' }}>
                {complianceStatus || '—'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="small text-muted mb-1">Findings / Observations</div>
          <div className="text-dark">{truncate(findings, 260) || '—'}</div>
        </div>

        {createdAt ? (
          <div className="mt-3 small text-muted">
            Created date:{' '}
            {typeof createdAt === 'string' ? createdAt : new Date(createdAt).toLocaleString()}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AuditCard;

