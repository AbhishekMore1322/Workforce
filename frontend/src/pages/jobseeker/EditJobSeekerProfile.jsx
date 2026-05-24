import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getRole } from '../../utils/tokenStorage';
import { getMyProfile, updateMyProfile, updateMySkills } from '../../api/jobSeekerApi';
import JobSeekerLayout from './components/JobSeekerLayout';

const JOB_SEEKER_ROLE = 'JOB_SEEKER';

const EditJobSeekerProfile = () => {
  const role = getRole();
  const navigate = useNavigate();

  if (role !== JOB_SEEKER_ROLE) return <Navigate to="/login" replace />;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSkills, setSavingSkills] = useState(false);
  const [error, setError] = useState('');
  const [skillsError, setSkillsError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [skillsSuccess, setSkillsSuccess] = useState('');

  const [form, setForm] = useState({
    name: '', dob: '', gender: '', address: '', contactInfo: '',
  });
  const [skillsJSON, setSkillsJSON] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const p = await getMyProfile();
        setForm({
          name: p?.name || '',
          dob: p?.dob ? String(p.dob).slice(0, 10) : '',
          gender: p?.gender || '',
          address: p?.address || '',
          contactInfo: p?.contactInfo || '',
        });
        setSkillsJSON(
          typeof p?.skillsJSON === 'string' ? p.skillsJSON
            : p?.skillsJSON ? JSON.stringify(p.skillsJSON)
            : ''
        );
      } catch (e) {
        setError(e?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccessMsg('');
    setSaving(true);
    try {
      await updateMyProfile({
        name: form.name,
        dob: form.dob,
        gender: form.gender,
        address: form.address,
        contactInfo: form.contactInfo,
        skillsJSON,
      });
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => navigate('/dashboard/jobseeker/profile'), 1200);
    } catch (e2) {
      setError(e2?.message || 'Profile update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleSkillsSubmit = async (e) => {
    e.preventDefault();
    setSkillsError(''); setSkillsSuccess('');
    if (!skillsJSON.trim()) { setSkillsError('Skills cannot be empty'); return; }
    setSavingSkills(true);
    try {
      await updateMySkills(skillsJSON);
      setSkillsSuccess('Skills updated!');
    } catch (e2) {
      setSkillsError(e2?.message || 'Skills update failed');
    } finally {
      setSavingSkills(false);
    }
  };

  if (loading) return (
    <JobSeekerLayout pageTitle="Edit Profile">
      <div className="alert alert-secondary">Loading...</div>
    </JobSeekerLayout>
  );

  return (
    <JobSeekerLayout pageTitle="Edit Profile">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h5 className="fw-bold mb-1">Edit Profile</h5>
          <div className="text-muted small">Update your personal information</div>
        </div>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/dashboard/jobseeker/profile')}>
          <i className="bi bi-arrow-left me-1" />Back
        </button>
      </div>

      {/* Profile form */}
      <div className="card shadow-sm rounded-3 border-0 mb-4">
        <div className="card-body p-4">
          <h6 className="fw-bold mb-3" style={{ color: '#7c3aed' }}>
            <i className="bi bi-person-fill me-2" />Personal Details
          </h6>

          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          {successMsg && <div className="alert alert-success py-2 small">{successMsg}</div>}

          <form onSubmit={handleProfileSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Full Name</label>
                <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Date of Birth</label>
                <input className="form-control" type="date" name="dob" value={form.dob} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Gender</label>
                <select className="form-select" name="gender" value={form.gender} onChange={handleChange} required>
                  <option value="">Select...</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Contact Email</label>
                <input className="form-control" type="email" name="contactInfo" value={form.contactInfo} onChange={handleChange} required />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Address</label>
                <textarea className="form-control" rows={3} name="address" value={form.address} onChange={handleChange} required />
              </div>
              <div className="col-12 d-flex gap-2 justify-content-end">
                <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/dashboard/jobseeker/profile')}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : <><i className="bi bi-check-circle me-1" />Save Profile</>}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Skills form */}
      <div className="card shadow-sm rounded-3 border-0">
        <div className="card-body p-4">
          <h6 className="fw-bold mb-3" style={{ color: '#7c3aed' }}>
            <i className="bi bi-tools me-2" />Update Skills
          </h6>

          {skillsError && <div className="alert alert-danger py-2 small">{skillsError}</div>}
          {skillsSuccess && <div className="alert alert-success py-2 small">{skillsSuccess}</div>}

          <form onSubmit={handleSkillsSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Skills</label>
              <textarea
                className="form-control"
                rows={4}
                value={skillsJSON}
                onChange={e => setSkillsJSON(e.target.value)}
                placeholder='e.g. ["JavaScript", "Communication", "React"]'
              />
              <div className="form-text">Enter as a JSON array or comma-separated text.</div>
            </div>
            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-primary" disabled={savingSkills}>
                {savingSkills ? 'Updating...' : <><i className="bi bi-check-circle me-1" />Update Skills</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </JobSeekerLayout>
  );
};

export default EditJobSeekerProfile;
