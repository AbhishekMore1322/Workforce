import React from 'react';
import StatusBadge from './StatusBadge';
import EnrollmentStatusSelector from './EnrollmentStatusSelector';

const EnrollmentTable = ({ enrollments, onStatusChange, updatingId }) => {
  if (!enrollments.length)
    return <div className="alert alert-secondary">No enrollments found.</div>;

  return (
    <div className="table-responsive">
      <table className="table align-middle table-hover">
        <thead>
          <tr style={{ background: 'linear-gradient(90deg, #00695c 0%, #00897b 100%)' }}>
            <th className="py-3 ps-4 border-0" style={{ color: '#fff', fontWeight: 600, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>ID</th>
            <th className="py-3 border-0" style={{ color: '#fff', fontWeight: 600, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Job Seeker</th>
            <th className="py-3 border-0" style={{ color: '#fff', fontWeight: 600, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</th>
            <th className="py-3 border-0" style={{ color: '#fff', fontWeight: 600, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Completion</th>
            <th className="py-3 border-0" style={{ color: '#fff', fontWeight: 600, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.06em', width: 240 }}>Update</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map((e) => {
            const id = e.enrollmentID || e.id;
            return (
              <tr key={id}>
                <td className="text-muted">{id}</td>
                <td>{e.seekerID || '-'}</td>
                <td>
                  <StatusBadge status={e.status} />
                </td>
                <td>{e.completionDate || '—'}</td>
                <td>
                  <EnrollmentStatusSelector
                    value={e.status}
                    disabled={updatingId === id}
                    onChange={(s) => onStatusChange(id, s)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EnrollmentTable;