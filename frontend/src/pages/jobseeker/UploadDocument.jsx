import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getRole } from '../../utils/tokenStorage';

import { uploadJobSeekerDocumentLinkBased } from '../../api/jobSeekerApi';
import JobSeekerLayout from './components/JobSeekerLayout';


const JOB_SEEKER_ROLE = 'JOB_SEEKER';

const UploadDocument = () => {
  const role = getRole();
  const navigate = useNavigate();

  if (role !== JOB_SEEKER_ROLE) return <Navigate to="/login" replace />;

  const [form, setForm] = useState({
    docType: '',
    fileURI: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.docType || !form.fileURI) {
      setError('Please provide both document type and a valid link.');
      return;
    }

    setLoading(true);
    try {
      await uploadJobSeekerDocumentLinkBased({
        docType: form.docType,
        fileURI: form.fileURI,
      });

      navigate('/dashboard/jobseeker/documents');
    } catch (e2) {
      setError(e2?.message || 'Document upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <JobSeekerLayout pageTitle="Upload Document">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
            <div>
              <h5 className="fw-bold mb-1">Upload Document</h5>
                  <div className="text-muted small">Use a shareable link (Google Drive, OneDrive, etc.)</div>
            </div>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/dashboard/jobseeker/documents')}>
              <i className="bi bi-arrow-left me-1" />Back
            </button>
          </div>

          <div className="card shadow-sm rounded-3 border-0">
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger py-2 small">
                  <i className="bi bi-exclamation-triangle me-2" />{error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Document Category</label>
                  <select className="form-select" name="docType" value={form.docType} onChange={handleChange} required>
                    <option value="">Select Category...</option>
                    <option value="RESUME">Resume / Portfolio</option>
                    <option value="ID_PROOF">Government ID Proof</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Document URL</label>
                  <input type="url" className="form-control" name="fileURI" value={form.fileURI} onChange={handleChange} placeholder="Google Drive or OneDrive link" required />
                  <div className="form-text">Ensure the link is publicly accessible.</div>
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Submitting...' : <><i className="bi bi-cloud-upload me-2" />Upload Document</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </JobSeekerLayout>
  );
};

export default UploadDocument;

