import React from 'react';
import StatusBadge from './StatusBadge';

const OPTIONS = [

  { value: 'ENROLLED', label: 'ENROLLED' },
  { value: 'COMPLETED', label: 'COMPLETED' },
  { value: 'CANCELLED', label: 'CANCELLED' },
];

const EnrollmentStatusSelector = ({ value, onChange, disabled }) => {
  return (
    <div>
      <div className="mb-1">
        <StatusBadge status={value} />
      </div>
      <select
        className="form-select form-select-sm"
        value={value || 'PENDING'}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default EnrollmentStatusSelector;

