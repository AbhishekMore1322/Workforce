import React from 'react';
import StatusBadge from './StatusBadge';
import { ApplicationStatus } from '../employerEnums';

const ApplicationCard = ({
  application,
  interview,
  onApprove,
  onReject,
  onViewResume,
  onAddNote,
  onScheduleInterview,
  onUpdateResult,
}) => {
  if (!application) return null;

  const { jobTitle, submittedDate, status } = application;
  const formatDate = (d) => (d ? String(d).slice(0, 10) : '-');

  const interviewStatus = interview?.status;
  const interviewResult = interview?.result;

  return (
    <div className="col-md-6">
      <div className="card shadow-sm border-0" style={{ borderRadius: 14 }}>
        <div className="card-body">

          <div className="d-flex align-items-start justify-content-between gap-3">
            <div>
              <h5 className="mb-1">{jobTitle}</h5>
              <div className="text-muted small">Applied: {formatDate(submittedDate)}</div>
            </div>
            <StatusBadge status={status} />
          </div>

          <div className="mt-3 d-flex gap-2 flex-wrap align-items-center">

            {/* SUBMITTED — can approve, reject, view resume, add note */}
            {status === ApplicationStatus.SUBMITTED && (
              <>
                <button className="btn btn-sm btn-outline-primary" onClick={onApprove}>Approve</button>
                <button className="btn btn-sm btn-outline-danger" onClick={onReject}>Reject</button>
                <button className="btn btn-sm btn-outline-secondary" onClick={onViewResume}>View Resume</button>
                <button className="btn btn-sm btn-outline-secondary" onClick={onAddNote}>Add Note</button>
              </>
            )}

            {/* REJECTED — show clear rejected state, no further actions */}
            {status === ApplicationStatus.REJECTED && (
              <span className="text-danger small fw-semibold">
                <i className="fas fa-times-circle me-1" />Application Rejected
              </span>
            )}

            {/* APPROVED + no interview yet — schedule interview */}
            {status === ApplicationStatus.APPROVED && !interviewStatus && (
              <button className="btn btn-sm btn-primary" onClick={onScheduleInterview}>
                <i className="fas fa-calendar-plus me-1" />Schedule Interview
              </button>
            )}

            {/* Interview SCHEDULED — show badge + allow marking result */}
            {interviewStatus === 'SCHEDULED' && (
              <>
                <span className="badge bg-info text-dark">
                  <i className="fas fa-calendar-check me-1" />Interview Scheduled
                </span>
                <button className="btn btn-sm btn-outline-success" onClick={onUpdateResult}>
                  Mark Result
                </button>
              </>
            )}

            {/* Interview COMPLETED — show result badge */}
            {interviewStatus === 'COMPLETED' && (
              <span className={`badge ${interviewResult === 'SHORTLISTED' ? 'bg-success' : 'bg-danger'}`}>
                <i className={`fas ${interviewResult === 'SHORTLISTED' ? 'fa-check-circle' : 'fa-times-circle'} me-1`} />
                Interview: {interviewResult || 'Completed'}
              </span>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
