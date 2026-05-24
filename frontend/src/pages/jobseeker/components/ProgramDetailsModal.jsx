import React from 'react';
import StatusBadge from './StatusBadge';

const formatDate = (d) => (d ? String(d).slice(0, 10) : '-');

const ProgramDetailsModal = ({ program, onClose, loading }) => {
  if (!program && !loading) return null;

  const title = program?.title || program?.programTitle || program?.name || '-';
  const description = program?.description || program?.details || '';
  const status = program?.status;

  return (
    <div className="js-modal-backdrop" role="dialog" aria-modal="true" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="js-modal-card" style={{ maxWidth: 560 }}>

        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #4f2fcf 100%)',
            padding: '1.5rem 1.75rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute', top: -40, right: -40,
              width: 140, height: 140, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,107,53,0.25) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <div className="d-flex align-items-start justify-content-between gap-3" style={{ position: 'relative', zIndex: 1 }}>
            <div>
              <div className="text-white mb-1" style={{ fontSize: '0.72rem', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.75 }}>
                Training Program
              </div>
              <h5 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em', fontSize: '1.15rem' }}>
                {loading ? 'Loading...' : title}
              </h5>
            </div>
            <button
              className="btn btn-sm"
              onClick={onClose}
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', borderRadius: 10, padding: '0.3rem 0.7rem', flexShrink: 0 }}
            >
              <i className="bi bi-x-lg" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem 1.75rem' }}>
          {loading ? (
            <div className="d-flex align-items-center gap-3 py-4 text-muted">
              <div className="spinner-border spinner-border-sm" style={{ color: '#7c3aed' }} />
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9rem' }}>Loading program details...</span>
            </div>
          ) : (
            <>
              {/* Status + Dates row */}
              <div className="d-flex align-items-center flex-wrap gap-3 mb-4">
                {status && <StatusBadge status={status} />}
                <div className="d-flex align-items-center gap-2 text-muted small">
                  <i className="bi bi-calendar-event" style={{ color: '#7c3aed' }} />
                  <span><strong style={{ color: '#0f0e17' }}>Start:</strong> {formatDate(program?.startDate)}</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-muted small">
                  <i className="bi bi-calendar-check" style={{ color: '#ff6b35' }} />
                  <span><strong style={{ color: '#0f0e17' }}>End:</strong> {formatDate(program?.endDate)}</span>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: '#f0f1f6', marginBottom: '1.25rem' }} />

              {/* Description */}
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '0.9rem',
                  color: '#4b5563',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                  background: '#f4f5fb',
                  borderRadius: 14,
                  padding: '1rem 1.1rem',
                  border: '1px solid #e8eaf0',
                }}
              >
                {description || 'No description provided.'}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!loading && (
          <div style={{ padding: '1rem 1.75rem', borderTop: '1px solid #f0f1f6', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn btn-sm"
              onClick={onClose}
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #4f2fcf 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '0.45rem 1.2rem',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramDetailsModal;
