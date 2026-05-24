import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getRole, getUsername, clearAuthData } from '../../utils/tokenStorage';
import { getMyProfile, deleteJobSeekerProfile } from '../../api/jobSeekerApi';
import JobSeekerLayout from './components/JobSeekerLayout';

const JOB_SEEKER_ROLE = 'JOB_SEEKER';

const JobSeekerProfile = () => {
  const role = getRole();
  const navigate = useNavigate();

  if (role !== JOB_SEEKER_ROLE) return <Navigate to="/login" replace />;

  const username = getUsername();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getMyProfile();
        setProfile(data || null);
      } catch (e) {
        setError(e?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDeactivate = async () => {
    try {
      setDeactivating(true);
      setError('');
      await deleteJobSeekerProfile();
      clearAuthData();
      navigate('/login');
    } catch (e) {
      setError(e?.message || 'Failed to deactivate profile');
      setDeactivating(false);
      setShowDeactivateModal(false);
    }
  };

  const skills = (() => {
    const raw = profile?.skillsJSON;
    try {
      if (!raw) return [];
      if (Array.isArray(raw)) return raw;
      if (typeof raw === 'string') {
        const trimmed = raw.trim();
        if (!trimmed) return [];
        try { return JSON.parse(trimmed); }
        catch { return trimmed.split(',').map(s => s.trim()).filter(s => s); }
      }
      if (typeof raw === 'object') return Array.isArray(Object.values(raw)) ? Object.values(raw) : [raw];
      return [];
    } catch { return []; }
  })();

  const profileCompletion = useMemo(() => {
    if (!profile) return 45;
    const fields = [profile?.name, profile?.dob, profile?.gender, profile?.address, profile?.contactInfo, profile?.skillsJSON];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [profile]);

  if (loading) {
    return (
      <JobSeekerLayout pageTitle="My Profile">
        <div className="alert alert-secondary">Loading profile...</div>
      </JobSeekerLayout>
    );
  }

  return (
    <JobSeekerLayout pageTitle="My Profile">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h5 className="fw-bold mb-1">My Profile</h5>
          <div className="text-muted small">Read-only view for {username || 'Job Seeker'}</div>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/dashboard')}>
            <i className="bi bi-arrow-left me-1" />Back
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/dashboard/jobseeker/profile/edit')}>
            <i className="bi bi-pencil me-1" />Edit Profile
          </button>
          <button className="btn btn-outline-primary btn-sm" onClick={() => navigate('/dashboard/jobseeker/documents')}>
            <i className="bi bi-file-earmark-text me-1" />Documents
          </button>
          <button className="btn btn-outline-danger btn-sm" onClick={() => setShowDeactivateModal(true)}>
            <i className="bi bi-trash me-1" />Deactivate
          </button>
        </div>
      </div>

      {error && <div className="alert alert-warning mb-4">{error}</div>}

      {/* Progress Bar */}
      <div className="card shadow-sm rounded-3 border-0 mb-4">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between mb-2">
            <span className="fw-semibold">Profile Completion</span>
            <span className="text-primary fw-bold">{profileCompletion}%</span>
          </div>
          <div className="progress mb-2" style={{ height: 10 }}>
            <div
              className={`progress-bar ${profileCompletion >= 85 ? 'bg-success' : 'bg-primary'}`}
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
          {profileCompletion < 100 && (
            <div className="text-muted small mt-1">Click <strong>Edit Profile</strong> above to complete your profile.</div>
          )}
        </div>
      </div>

      <div className="row g-4">
        {/* Profile Details */}
        <div className="col-lg-7">
          <div className="card shadow-sm rounded-3 border-0">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3"><i className="bi bi-person me-2 text-primary" />Personal Information</h6>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-semibold">Name</label>
                  <div className="form-control bg-light border-0 fw-semibold">{profile?.name || '-'}</div>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-semibold">Date of Birth</label>
                  <div className="form-control bg-light border-0 fw-semibold">{profile?.dob ? String(profile.dob).slice(0, 10) : '-'}</div>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-semibold">Gender</label>
                  <div className="form-control bg-light border-0 fw-semibold">{profile?.gender || '-'}</div>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-semibold">Contact</label>
                  <div className="form-control bg-light border-0 fw-semibold">{profile?.contactInfo || profile?.email || '-'}</div>
                </div>
                <div className="col-12">
                  <label className="form-label text-muted small fw-semibold">Address</label>
                  <div className="form-control bg-light border-0 fw-semibold">{profile?.address || '-'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="col-lg-5">
          <div className="card shadow-sm rounded-3 border-0">
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold mb-0"><i className="bi bi-stars me-2 text-warning" />Skills</h6>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => navigate('/dashboard/jobseeker/profile/edit')}
                >
                  <i className="bi bi-pencil me-1" />Update Skills
                </button>
              </div>
              {skills.length ? (
                <div className="d-flex flex-wrap gap-2">
                  {skills.map((s, idx) => (
                    <span key={idx} className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-2 rounded-pill fw-semibold">
                      {typeof s === 'string' ? s : s?.name || '-'}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-muted">No skills added yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Deactivate Modal */}
      {showDeactivateModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-3">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Deactivate Profile</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeactivateModal(false)} disabled={deactivating} />
              </div>
              <div className="modal-body">
                <p className="mb-2 text-danger">
                  <i className="bi bi-exclamation-triangle me-2" />
                  <strong>Warning:</strong> This action cannot be undone.
                </p>
                <p className="text-muted">
                  Deactivating your profile will permanently delete your account and all associated data including job applications, enrollments, and documents.
                </p>
              </div>
              <div className="modal-footer border-top">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowDeactivateModal(false)} disabled={deactivating}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDeactivate} disabled={deactivating}>
                  {deactivating ? 'Deactivating...' : 'Yes, Deactivate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </JobSeekerLayout>
  );
};

export default JobSeekerProfile;
