import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import InterviewResultModal from './components/InterviewResultModal';
import EmptyState from './components/EmptyState';

import {
  getEmployerInterviews,
  updateInterviewStatus,
  createPlacement,
} from '../../api/employerApi';

const EmployerInterviews = () => {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const refreshInterviews = async () => {
    const toList = (data) => {
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.interviews)) return data.interviews;
      if (Array.isArray(data?.items)) return data.items;
      return [];
    };

    try {
      setLoading(true);
      setError('');

      const res = await getEmployerInterviews();
      const data = res?.data ?? res;

      const interviewsList = toList(data);
      const normalized = interviewsList.map((it) => {
        const interviewID = it.interviewID ?? it.id ?? it.interview_id;
        const applicationID = it.applicationID ?? it.application_id;

        return {
          ...it,
          interviewID,
          applicationID:
            applicationID != null ? Number(applicationID) : applicationID,
          status: it.status,
          result: it.result,
        };
      });

      setInterviews(normalized);
    } catch (e) {
      setError(e.message || 'Failed to load interviews');
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    refreshInterviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



const updateResult = async (result) => {
  try {
    setLoading(true);
    setError('');

    
    const interviewId = selected?.interviewID ?? selected?.id;

    await updateInterviewStatus(interviewId, {
      status: 'COMPLETED',
      result,
    });

    setShowResultModal(false);
    setSelected(null);
    await refreshInterviews();
  } catch (e) {
    setError(e.message || 'Failed to update interview result');
  } finally {
    setLoading(false);
  }
};

 const createPlacementForInterview = async (interview) => {
  try {
    await createPlacement({
      applicationID: interview.applicationID,
      employerID: Number(localStorage.getItem('workforce_employerId')),
      position: interview.jobTitle || 'Position Not Available',
      startDate: new Date().toISOString().slice(0, 10),
    });

    alert('✅ Placement created successfully');

    await refreshInterviews();

  } catch (e) {
    alert(e.message || '❌ Failed to create placement');
  }
};


  return (
    <AppLayout pageTitle="Scheduled Interviews">
      <div className="container py-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h3 className="fw-bold text-success">
              Scheduled Interviews
            </h3>
            <p className="text-muted mb-0">
              Manage scheduled interviews and update results.
            </p>
          </div>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate('/dashboard/employer')}
          >
            Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small mb-3">
            {error}
          </div>
        )}

        {(() => {
          const scheduled = interviews.filter((i) => i.status === 'SCHEDULED');
          const completed = interviews.filter((i) => i.status === 'COMPLETED');

          const renderList = (list, emptyTitle, emptyDesc, emptyIcon) =>
            list.length === 0 ? (
              <EmptyState title={emptyTitle} description={emptyDesc} icon={emptyIcon} />
            ) : (
              <div className="row g-4">
                {list.map((i) => (
                  <div className="col-md-6" key={i.interviewID}>
                    <div className="card shadow-sm border-0 p-4">
                      <h5 className="fw-bold">Interview #{i.interviewID}</h5>

                      <div className="text-muted small">
                        Application ID: {i.applicationID}
                      </div>

                      <div className="mt-2">
                        <span className="badge bg-info me-2">{i.status}</span>

                        {i.result && (
                          <span className="badge bg-secondary">{i.result}</span>
                        )}
                      </div>

                      <div className="mt-3 d-flex gap-2">
                        {i.status === 'SCHEDULED' && (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => {
                              setSelected(i);
                              setShowResultModal(true);
                            }}
                          >
                            Update Interview Result
                          </button>
                        )}

                        {i.status === 'COMPLETED' &&
                          i.result === 'SHORTLISTED' && (
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => createPlacementForInterview(i)}
                            >
                              Create Placement
                            </button>
                          )}

                        {i.status === 'COMPLETED' &&
                          i.result === 'REJECTED' && (
                            <span className="badge bg-danger align-self-center">
                              Rejected
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );

          return (
            <>
              <h5 className="fw-bold mt-2">Scheduled Interviews</h5>
              {renderList(
                scheduled,
                'No scheduled interviews',
                'You have no interviews scheduled right now.',
                'fa-calendar-times'
              )}

              <h5 className="fw-bold mt-4">Completed Interviews</h5>
              {renderList(
                completed,
                'No completed interviews',
                'You have not completed any interviews yet.',
                'fa-check-circle'
              )}
            </>
          );
        })()}
      </div>

      <InterviewResultModal
        open={showResultModal}
        onClose={() => setShowResultModal(false)}
        onSave={updateResult}
        loading={loading}
        error={error}
      />
    </AppLayout>
  );
};

export default EmployerInterviews;