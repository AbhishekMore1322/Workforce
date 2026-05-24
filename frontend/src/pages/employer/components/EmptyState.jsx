import React from 'react';

const THEME_COLOR = '#00796b';

const EmptyState = ({
  title = 'Nothing here yet',
  description,
  icon = 'fa-inbox',
}) => {
  return (
    <div
      className="card border-0 shadow-sm p-5 bg-white"
      style={{ borderRadius: 16 }}
      role="status"
      aria-live="polite"
    >
      <div className="text-center">
        <div
          className="mx-auto mb-3 d-flex align-items-center justify-content-center"
          style={{
            width: 54,
            height: 54,
            borderRadius: 18,
            background: '#e7f3f0',
            color: THEME_COLOR,
          }}
        >
          <i className={`fas ${icon}`} aria-hidden="true" />
        </div>

        <h5 className="fw-bold">{title}</h5>

        {description && (
          <p className="text-muted small mb-0">{description}</p>
        )}
      </div>
    </div>
  );
};

export default EmptyState;