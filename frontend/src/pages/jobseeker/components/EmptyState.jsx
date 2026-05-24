import React from 'react';

const EmptyState = ({ title, message, action }) => (
  <div className="wf-empty">
    <div className="wf-empty__icon">
      <i className="bi bi-inbox-fill" />
    </div>
    <div className="wf-empty__title">{title || 'Nothing here yet'}</div>
    {message && <p className="wf-empty__msg">{message}</p>}
    {action && <div>{action}</div>}
  </div>
);

export default EmptyState;
