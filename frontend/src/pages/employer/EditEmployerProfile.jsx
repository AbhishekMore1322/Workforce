import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getRole } from '../../utils/tokenStorage';
import DashboardHeader from '../../components/DashboardHeader';
import DashboardFooter from '../../components/DashboardFooter';
import EmptyState from './components/EmptyState';
import { getEmployerProfile, updateEmployerProfile } from '../../api/employerApi';
import { getEmployerId } from '../../utils/tokenStorage';


const EditEmployerProfile = () => {
  const role = getRole();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    industry: '',
    address: '',
    contactInfo: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (role !== 'EMPLOYER') return;
    (async () => {
      try {
        setLoading(true);
        const data = await getEmployerProfile();
        setForm({
          name: data?.name || '',
          industry: data?.industry || '',
          address: data?.address || '',
          contactInfo: data?.contactInfo || data?.contact || '',
          description: data?.description || '',
        });
      } catch {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    })();
  }, [role]);

  if (role !== 'EMPLOYER') return <Navigate to="/login" replace />;

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {

      await updateEmployerProfile({
        name: form.name,
        industry: form.industry,
        address: form.address,
        contactInfo: form.contactInfo,
        description: form.description,
      });
      navigate('/dashboard/employer/profile');
    } catch (err) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <DashboardHeader />

      <div className="container py-5" style={{ paddingTop: 30 }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h3 className="fw-bold" style={{ color: '#00796b' }}>Edit Company Profile</h3>
            <p className="text-muted mb-0">Update your company details for better matching.</p>
          </div>
          <button className="btn btn-outline-secondary" onClick={() => navigate('/dashboard/employer/profile')}>
            Back
          </button>
        </div>

        {loading ? (
          <EmptyState title="Loading" description="Fetching profile details..." icon="fa-spinner" />
        ) : (
          <div className="card border-0 shadow-sm p-4 bg-white" style={{ borderRadius: 16 }}>
            {error ? (
              <div className="alert alert-danger py-2 small d-flex align-items-center shadow-sm mb-3">
                <i className="fas fa-exclamation-triangle me-2"></i>
                <span>{error}</span>
              </div>
            ) : null}

            <form onSubmit={onSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary text-uppercase">Company Name</label>
                  <input className="form-control" name="name" value={form.name} onChange={onChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary text-uppercase">Industry</label>
                  <input className="form-control" name="industry" value={form.industry} onChange={onChange} required />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary text-uppercase">Address</label>
                  <input className="form-control" name="address" value={form.address} onChange={onChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary text-uppercase">Contact Info</label>
                  <input className="form-control" name="contactInfo" value={form.contactInfo} onChange={onChange} required />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-bold text-secondary text-uppercase">Description</label>
                  <textarea className="form-control" name="description" value={form.description} onChange={onChange} rows={4} />
                </div>
              </div>

              <div className="d-flex gap-2 mt-4">
                <button className="btn btn-primary flex-fill" disabled={saving} type="submit">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button className="btn btn-outline-secondary" type="button" onClick={() => navigate('/dashboard/employer/profile')}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <DashboardFooter />
    </div>
  );
};

export default EditEmployerProfile;

