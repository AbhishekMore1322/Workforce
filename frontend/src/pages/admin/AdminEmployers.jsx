import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRole } from '../../utils/tokenStorage';
import { getAllEmployers, updateEmployerStatus } from '../../api/adminApi';
import StatusBadge from './components/StatusBadge';
import AdminTable from './components/AdminTable';

const AdminEmployers = () => {
  const navigate = useNavigate();
  const role = getRole();

  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (role !== 'ADMIN') {
      navigate('/login');
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getAllEmployers();
        setEmployers(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message || 'Failed to load employers');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [navigate, role]);

 
  const columns = useMemo(
    () => [
      {
        key: 'name',
        label: 'Employer',
        render: (r) => (
          <div className="fw-semibold">
            {r.name || r.companyName || '-'}
          </div>
        ),
      },
      {
        key: 'industry',
        label: 'Industry',
        render: (r) => r.industry || '-',
      },
      {
        key: 'status',
        label: 'Status',
        render: (r) => <StatusBadge status={r.status} />,
      },
    ],
    []
  );

  
  const handleStatusChange = async (employer, nextStatus) => {
    if (!employer.employerID) {
      console.error('Missing employerID:', employer);
      return;
    }

    try {
      await updateEmployerStatus(employer.employerID, nextStatus);

      setEmployers((prev) =>
        prev.map((e) =>
          e.employerID === employer.employerID
            ? { ...e, status: nextStatus }
            : e
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  if (role !== 'ADMIN') return null;

  return (
    <div className="p-5 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <h2 className="fw-bold text-dark">Employer Verification</h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-jade" />
          <div className="text-muted small mt-2">
            Loading employers...
          </div>
        </div>
      ) : (
        <AdminTable
          columns={columns}
          rows={employers}
          emptyText="No employers found."
          renderRowActions={(employer) => {
            const status = (employer.status || '').toUpperCase();

            return (
              <div className="d-flex flex-column gap-2" style={{ minWidth: 210 }}>
                {status !== 'APPROVED' && (
                  <button
                    className="btn btn-jade btn-sm text-white"
                    style={{ backgroundColor: '#00796b' }}
                    onClick={() =>
                      handleStatusChange(employer, 'APPROVED')
                    }
                  >
                    Approve
                  </button>
                )}

                {status !== 'REJECTED' && (
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() =>
                      handleStatusChange(employer, 'REJECTED')
                    }
                  >
                    Reject
                  </button>
                )}
              </div>
            );
          }}
        />
      )}
    </div>
  );
};

export default AdminEmployers;
