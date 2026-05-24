import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getRole } from '../../utils/tokenStorage';
import { getMyDocuments, deleteDocument } from '../../api/jobSeekerApi';
import JobSeekerLayout from './components/JobSeekerLayout';
import DocumentCard from './components/DocumentCard';
import EmptyState from './components/EmptyState';

const JOB_SEEKER_ROLE = 'JOB_SEEKER';

const JobSeekerDocuments = () => {
  const role = getRole();
  const navigate = useNavigate();

  if (role !== JOB_SEEKER_ROLE) return <Navigate to="/login" replace />;

  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getMyDocuments();
        setDocuments(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e?.message || 'Failed to load documents');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (docId) => {
    if (!docId) return;
    if (!window.confirm('Delete this document?')) return;
    try {
      setDeletingId(docId);
      setError('');
      await deleteDocument(docId);
      setDocuments(prev => prev.filter(d => {
        const id = d?.documentID || d?.docId || d?.id;
        return String(id) !== String(docId);
      }));
    } catch (e) {
      setError(e?.message || 'Failed to delete document');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <JobSeekerLayout pageTitle="My Documents">
      <div className="card shadow-sm rounded-3 border-0">
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
            <div>
              <h5 className="fw-bold mb-1">My Documents</h5>
              <div className="text-muted small">Manage your uploaded documents</div>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/dashboard')}>
                <i className="bi bi-arrow-left me-1" />Back
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/dashboard/jobseeker/documents/upload')}>
                <i className="bi bi-upload me-1" />Upload Document
              </button>
            </div>
          </div>

          {error && <div className="alert alert-warning">{error}</div>}

          {loading ? (
            <div className="alert alert-secondary">Loading documents...</div>
          ) : documents.length === 0 ? (
            <EmptyState
              title="No documents yet"
              message="Upload your resume and ID proof to get started."
              action={
                <button className="btn btn-primary" onClick={() => navigate('/dashboard/jobseeker/documents/upload')}>
                  Upload now
                </button>
              }
            />
          ) : (
            <div className="row g-4">
              {documents.map((d) => {
                const id = d?.documentID || d?.docId || d?.id;
                return (
                  <DocumentCard
                    key={id}
                    doc={d}
                    onDelete={handleDelete}
                    deleting={deletingId === id}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </JobSeekerLayout>
  );
};

export default JobSeekerDocuments;
