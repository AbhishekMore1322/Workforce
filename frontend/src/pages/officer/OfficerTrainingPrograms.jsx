import React, { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { getRole } from '../../utils/tokenStorage';
import DashboardFooter from '../../components/DashboardFooter';
import { getTrainingPrograms } from '../../api/programManagerApi';
import { getEnrollmentsByProgram } from '../../api/officerApi';




const OfficerTrainingPrograms = () => {

  const role = getRole();
  if (role !== 'OFFICER') return <Navigate to="/login" replace />;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [programs, setPrograms] = useState([]);

  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programEnrollments, setProgramEnrollments] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getTrainingPrograms();
        setPrograms(Array.isArray(data) ? data : data?.programs ?? data?.data ?? []);
      } catch (e) {
        setError(e?.message || 'Failed to load training programs');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const sortedPrograms = useMemo(() => {
    return [...programs].sort((a, b) => {
      const aid = a?.programID ?? a?.programId ?? a?.id ?? 0;
      const bid = b?.programID ?? b?.programId ?? b?.id ?? 0;
      return Number(aid) - Number(bid);
    });
  }, [programs]);


  const handleViewEnrollments = async (program) => {
    const programId = program?.programID ?? program?.programId ?? program?.id;
    if (!programId) return;

    try {
      setLoadingEnrollments(true);
      setError('');

      const res = await getEnrollmentsByProgram(programId);
      const enrollments = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
          ? res.data
          : [];

      setSelectedProgram(program);
      setProgramEnrollments(enrollments);
    } catch (e) {
      setError(e?.message || 'Failed to load enrollments');
    } finally {
      setLoadingEnrollments(false);
    }
  };





  return (
    <div className="bg-light min-vh-100">
      <div className="container py-5" style={{ paddingTop: 30 }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h3 className="fw-bold" style={{ color: '#00796b' }}>
              Training Programs
            </h3>
            <p className="text-muted mb-0">View program details and all enrollments.</p>
          </div>
        </div>

        {error ? (
          <div className="alert alert-danger py-2 small d-flex align-items-center shadow-sm mb-3">
            <i className="fas fa-exclamation-triangle me-2" />
            <span>{error}</span>
          </div>
        ) : null}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" />
          </div>
        ) : sortedPrograms.length === 0 ? (
          <div className="text-muted text-center py-5">No training programs found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr className="bg-light">
                  <th className="ps-4">Program</th>
                  <th>Status</th>
                  <th>Dates</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedPrograms.map((p) => {
                  const programId = p?.programID ?? p?.programId ?? p?.id;
                  const status = p?.status ? String(p.status).toUpperCase() : '—';
                  return (
                    <tr key={programId ?? JSON.stringify(p)} className="hover:bg-gray-50">
                      <td className="ps-4">
                        <div className="fw-semibold">{p?.title ?? '-'}</div>
                        <div className="text-muted small">ID: {programId ?? '-'}</div>
                      </td>
                      <td>{status}</td>
                      <td>
                        {p?.startDate ? new Date(p.startDate).toLocaleDateString() : '-'}
                        {' - '}
                        {p?.endDate ? new Date(p.endDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="text-end pe-4">
                        <button
                          className="btn btn-jade btn-sm text-white"
                          style={{ backgroundColor: '#00796b' }}
                          onClick={() => handleViewEnrollments(p)}
                        >
                          View Enrollments
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {selectedProgram ? (
          <div className="mt-4">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div>
                <h5 className="fw-bold" style={{ color: '#00796b' }}>
                  Enrollments
                </h5>
                <div className="text-muted small">
                  Program ID:{' '}
                  {selectedProgram?.programID ?? selectedProgram?.programId ?? selectedProgram?.id ?? '-'}
                </div>
              </div>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => {
                  setSelectedProgram(null);
                  setProgramEnrollments([]);
                }}
              >
                Close
              </button>
            </div>

            {loadingEnrollments ? (
              <div className="text-center py-4">
                <div className="spinner-border" />
              </div>
            ) : programEnrollments.length === 0 ? (
              <div className="text-muted py-3">No enrollments found.</div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr className="bg-light">
                      <th className="ps-4">Enrollment ID</th>
                      <th>Program ID</th>
                      <th>Seeker ID</th>
                      <th>Completion Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {programEnrollments.map((e) => {
                      const enrollmentID = e?.enrollmentID ?? e?.enrollmentId ?? e?.id;
                      const completionDate = e?.completionDate;
                      return (
                        <tr key={enrollmentID ?? JSON.stringify(e)} className="hover:bg-gray-50">
                          <td className="ps-4">{enrollmentID ?? '-'}</td>
                          <td>{e?.programID ?? e?.programId ?? '-'}</td>
                          <td>{e?.seekerID ?? e?.seekerId ?? '-'}</td>
                          <td>
                            {completionDate ? new Date(completionDate).toLocaleDateString() : '—'}
                          </td>
                          <td>{e?.status ? String(e.status).toUpperCase() : '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : null}

      </div>
    </div>
  );
};

export default OfficerTrainingPrograms;

