import React, { useEffect, useState } from 'react';
import { getRole } from '../../utils/tokenStorage';
import {
  getAllTrainingPrograms,
  getTrainingProgramById,
  getEnrollmentsByProgram,
  updateEnrollmentStatus,
} from '../../api/adminApi';
import StatusBadge from './components/StatusBadge';

const Modal = ({ open, title, onClose, children }) => {
  if (!open) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100"
      style={{ background: 'rgba(0,0,0,0.45)', zIndex: 1050 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded shadow p-4"
        style={{ maxWidth: 800, margin: '80px auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">{title}</h5>
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const formatDate = (d) => (d ? d : '-');

const AdminPrograms = () => {
  const role = getRole();
  const isProgramManager = role === 'PROGRAM_MANAGER';

  if (role !== 'ADMIN' && role !== 'PROGRAM_MANAGER') return null;

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoverId, setHoverId] = useState(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [details, setDetails] = useState(null);

  const [enrollmentsOpen, setEnrollmentsOpen] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);


  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getAllTrainingPrograms();
      setPrograms(Array.isArray(data) ? data : []);
      setLoading(false);
    };
    load();
  }, []);


  const openDetails = async (programId) => {
    const data = await getTrainingProgramById(programId);
    setDetails(data);
    setDetailsOpen(true);
  };

  const openEnrollments = async (programId) => {
    const list = await getEnrollmentsByProgram(programId);
    setEnrollments(Array.isArray(list) ? list : []);
    setEnrollmentsOpen(true);
  };

  const changeEnrollmentStatus = async (enrollmentId, status) => {
    if (!isProgramManager) return;

    setUpdatingId(enrollmentId);
    const updated = await updateEnrollmentStatus(enrollmentId, status);

    setEnrollments((prev) =>
      prev.map((e) =>
        e.enrollmentID === updated.enrollmentID ? updated : e
      )
    );
    setUpdatingId(null);
  };


  return (
    <div className="p-5 bg-light min-vh-100">
      <h2 className="fw-bold mb-4">Training Programs</h2>

      {loading ? (
        <div className="text-muted">Loading programs...</div>
      ) : programs.length === 0 ? (
        <div className="alert alert-secondary">No training programs found.</div>
      ) : (
        <div className="row g-4">
          {programs.map((p) => (
            <div key={p.programID} className="col-md-4">
              <div
                className="card h-100 shadow-sm"
                style={{ borderRadius: 14 }}
                onMouseEnter={() => setHoverId(p.programID)}
                onMouseLeave={() => setHoverId(null)}
              >
                <div className="card-body d-flex flex-column">
                  <h5 className="mb-2">{p.title}</h5>
                  <div className="mb-2">
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="text-muted small mb-3">
                    {formatDate(p.startDate)} → {formatDate(p.endDate)}
                  </div>

                  {hoverId === p.programID && (
                    <div className="mt-auto d-flex gap-2">
                      <button
                        className="btn btn-sm btn-primary flex-fill"
                        onClick={() => openDetails(p.programID)}
                      >
                        View Program Details
                      </button>
                      <button
                        className="btn btn-sm btn-outline-primary flex-fill"
                        onClick={() => openEnrollments(p.programID)}
                      >
                        View Enrollments
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}


      <Modal
        open={detailsOpen}
        title="Program Details"
        onClose={() => setDetailsOpen(false)}
      >
        {details && (
          <>
            <h4>{details.title}</h4>
            <StatusBadge status={details.status} />
            <p className="mt-3 text-muted">{details.description}</p>

            <div className="bg-light rounded p-3 mt-3">
              <div className="small text-muted">Date Range</div>
              <div className="fw-semibold">
                {formatDate(details.startDate)} → {formatDate(details.endDate)}
              </div>
            </div>
          </>
        )}
      </Modal>


      <Modal
        open={enrollmentsOpen}
        title="Program Enrollments"
        onClose={() => setEnrollmentsOpen(false)}
      >
        {enrollments.length === 0 ? (
          <div className="alert alert-secondary">
            No enrollments for this program.
          </div>
        ) : (
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Enrollment ID</th>
                <th>Job Seeker ID</th>
                <th>Status</th>
                <th>Completion Date</th>
                {isProgramManager && <th>Update</th>}
              </tr>
            </thead>
            <tbody>
              {enrollments.map((e) => (
                <tr key={e.enrollmentID}>
                  <td>{e.enrollmentID}</td>
                  <td>{e.seekerID}</td>
                  <td><StatusBadge status={e.status} /></td>
                  <td>{formatDate(e.completionDate)}</td>
                  {isProgramManager && (
                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={e.status}
                        disabled={updatingId === e.enrollmentID}
                        onChange={(ev) =>
                          changeEnrollmentStatus(e.enrollmentID, ev.target.value)
                        }
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="ENROLLED">ENROLLED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Modal>
    </div>
  );
};

export default AdminPrograms;