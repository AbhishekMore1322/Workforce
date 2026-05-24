import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getRole } from '../../utils/tokenStorage';
import { getEmployerProfile } from '../../api/employerApi';
import AppLayout from '../../components/AppLayout';

const INDUSTRY_ICONS = {
  Technology: 'fa-microchip',
  Finance: 'fa-chart-line',
  Healthcare: 'fa-heartbeat',
  Education: 'fa-graduation-cap',
  Retail: 'fa-shopping-bag',
  Manufacturing: 'fa-industry',
  Construction: 'fa-hard-hat',
  Logistics: 'fa-truck',
  Media: 'fa-film',
  Hospitality: 'fa-concierge-bell',
};

const getIndustryIcon = (industry) =>
  INDUSTRY_ICONS[industry] || 'fa-building';

const InfoCard = ({ icon, label, value }) => (
  <div className="d-flex align-items-start gap-3 p-3 rounded-3"
    style={{ background: '#f8fffe', border: '1px solid #e0f0ed' }}>
    <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
      style={{ width: 40, height: 40, background: '#e7f3f0', color: '#00796b' }}>
      <i className={`fas ${icon}`} />
    </div>
    <div style={{ minWidth: 0 }}>
      <div className="text-muted" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{label}</div>
      <div className="fw-bold text-truncate" style={{ color: '#0d1f1c', fontSize: '0.95rem' }}>{value || '—'}</div>
    </div>
  </div>
);

const EmployerProfile = () => {
  const role = getRole();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  if (role !== 'EMPLOYER') return <Navigate to="/login" replace />;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const employerId = localStorage.getItem('workforce_employerId');
        if (!employerId) throw new Error('Employer session not found');
        const data = await getEmployerProfile(employerId);
        setProfile(data);
      } catch (err) {
        console.error('Failed to load employer profile:', err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const initials = profile?.name
    ? profile.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <AppLayout pageTitle="Company Profile">
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {loading ? (
          <div className="d-flex align-items-center gap-3 p-5 text-muted">
            <div className="spinner-border spinner-border-sm" style={{ color: '#00796b' }} />
            <span>Loading profile…</span>
          </div>
        ) : !profile ? (
          <div className="text-center py-5 text-muted">
            <i className="fas fa-building fa-3x mb-3 d-block" style={{ color: '#b2dfdb' }} />
            <div className="fw-bold">Profile not found</div>
            <div className="small">Your employer profile is not available.</div>
          </div>
        ) : (
          <>
            {/* ── Avatar + Name ── */}
            <div className="card border-0 shadow-sm p-4 mb-4 d-flex flex-row align-items-center gap-4" style={{ borderRadius: 20, background: '#fff' }}>
              <div className="d-flex align-items-center justify-content-center fw-bold shadow-sm flex-shrink-0"
                style={{
                  width: 72, height: 72, borderRadius: 18,
                  background: 'linear-gradient(135deg, #00897b, #004d40)',
                  color: '#fff', fontSize: '1.6rem',
                  fontFamily: "'Syne', sans-serif",
                }}>
                {initials}
              </div>
              <div>
                <h4 className="fw-bold mb-0" style={{ color: '#0d1f1c', fontFamily: "'Syne', sans-serif" }}>
                  {profile.name}
                </h4>
                <div className="text-muted small">{profile.industry || 'Industry not set'}</div>
              </div>
            </div>

            {/* ── Info cards ── */}
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <InfoCard icon="fa-building" label="Company Name" value={profile.name} />
              </div>
              <div className="col-md-6">
                <InfoCard icon={getIndustryIcon(profile.industry)} label="Industry" value={profile.industry} />
              </div>
              <div className="col-md-6">
                <InfoCard icon="fa-envelope" label="Contact Email" value={profile.contactInfo} />
              </div>
              <div className="col-md-6">
                <InfoCard icon="fa-id-badge" label="Employer ID" value={`#${profile.employerID}`} />
              </div>
            </div>

            {/* ── Company highlights strip ── */}
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 16, background: '#fff' }}>
              <div className="fw-bold mb-3" style={{ color: '#00796b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                <i className="fas fa-star me-2" />Company Highlights
              </div>
              <div className="row g-3 text-center">
                {[
                  { icon: 'fa-users',      label: 'Talent Network',  value: 'Active' },
                  { icon: 'fa-shield-alt', label: 'Verified',        value: 'Employer' },
                  { icon: 'fa-globe',      label: 'Platform',        value: 'WorkForce' },
                  { icon: 'fa-award',      label: 'Member Since',    value: '2024' },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="col-6 col-md-3">
                    <div className="p-3 rounded-3" style={{ background: '#f0f7f5' }}>
                      <i className={`fas ${icon} mb-2 d-block`} style={{ color: '#00796b', fontSize: '1.3rem' }} />
                      <div className="fw-bold small" style={{ color: '#0d1f1c' }}>{value}</div>
                      <div className="text-muted" style={{ fontSize: '0.7rem' }}>{label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default EmployerProfile;
