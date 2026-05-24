import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import { getTrainingPrograms, getTrainingReport } from '../../api/programManagerApi';
import { getUsername } from '../../utils/tokenStorage';

const C = { teal: '#00897b', tealLt: '#e0f2f1', coral: '#ff6b35', amber: '#f59e0b', blue: '#0ea5e9', green: '#22c55e' };

const KPI = ({ label, value, icon, color, sub }) => (
  <div className="col-6 col-md-3">
    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ height: 3, background: color }} />
      <div className="card-body p-3">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="text-muted" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{label}</span>
          <div className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32, background: color + '18', color, fontSize: '0.85rem' }}>
            <i className={`fas ${icon}`} />
          </div>
        </div>
        <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0d1f1c', lineHeight: 1, fontFamily: "'Syne', sans-serif" }}>{value}</div>
        {sub && <div className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>{sub}</div>}
      </div>
    </div>
  </div>
);

const QuickBtn = ({ icon, label, color, onClick }) => (
  <div className="col-6 col-md-3">
    <button onClick={onClick} className="w-100 border-0 p-3 d-flex flex-column align-items-center gap-2"
      style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 10px rgba(13,31,28,0.06)', cursor: 'pointer', transition: 'all 0.2s', border: `1.5px solid #e0f0ed` }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
      <div className="rounded-circle d-flex align-items-center justify-content-center"
        style={{ width: 44, height: 44, background: color + '18', color, fontSize: '1.1rem' }}>
        <i className={`fas ${icon}`} />
      </div>
      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0d1f1c', fontFamily: "'Space Grotesk', sans-serif" }}>{label}</span>
    </button>
  </div>
);

const ProgramManagerDashboard = () => {
  const navigate = useNavigate();
  const username = getUsername();
  const [counts, setCounts] = useState({ total: 0, active: 0, enrollments: 0, completed: 0, active_enroll: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [programs, rpt] = await Promise.all([getTrainingPrograms(), getTrainingReport()]);
        const list = Array.isArray(programs) ? programs : [];
        const r = rpt ?? {};
        setCounts({
          total:        list.length,
          active:       list.filter(p => String(p.status || '').toUpperCase() === 'ACTIVE').length,
          enrollments:  Number(r.totalEnrollments ?? 0),
          completed:    Number(r.completedEnrollments ?? 0),
          active_enroll: Number(r.activeEnrollments ?? 0),
        });
      } catch {
        setCounts({ total: 0, active: 0, enrollments: 0, completed: 0, active_enroll: 0 });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const completionPct = counts.enrollments > 0 ? Math.round((counts.completed / counts.enrollments) * 100) : 0;

  return (
    <AppLayout pageTitle="Program Manager">
      {/* ── Welcome banner ── */}
      <div className="rounded-4 p-4 mb-4 text-white position-relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #00897b 0%, #00695c 50%, #004d40 100%)', boxShadow: '0 8px 32px rgba(0,137,123,0.28)' }}>
        <div style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,107,53,0.15)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '0.75rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Program Manager</div>
          <h4 className="fw-bold mb-1 mt-1" style={{ fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em' }}>
            Welcome back, {username || 'Manager'} 🎓
          </h4>
          <p className="mb-0" style={{ opacity: 0.75, fontSize: '0.9rem' }}>Oversee training execution, monitor enrollments and track outcomes.</p>
        </div>
      </div>

      {/* ── KPI cards ── */}
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border" style={{ color: C.teal }} /></div>
      ) : (
        <>
          <div className="row g-3 mb-4">
            <KPI label="Total Programs"    value={counts.total}         icon="fa-book"         color={C.teal}  sub="All programs" />
            <KPI label="Active Programs"   value={counts.active}        icon="fa-play-circle"  color={C.green} sub="Currently running" />
            <KPI label="Total Enrollments" value={counts.enrollments}   icon="fa-users"        color={C.blue}  sub="Across all programs" />
            <KPI label="Completed"         value={counts.completed}     icon="fa-check-double" color={C.amber} sub="Finished enrollments" />
          </div>

          {/* ── Completion progress ── */}
          <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 16 }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <div className="fw-bold" style={{ fontFamily: "'Syne', sans-serif", color: '#0d1f1c' }}>Overall Completion Rate</div>
                <div className="text-muted small">{counts.active_enroll} active · {counts.completed} completed · {counts.enrollments} total</div>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: C.teal, fontFamily: "'Syne', sans-serif" }}>{completionPct}%</div>
            </div>
            <div style={{ height: 10, background: '#f0f4f2', borderRadius: 99 }}>
              <div style={{ height: '100%', width: `${completionPct}%`, background: `linear-gradient(90deg, ${C.teal}, ${C.green})`, borderRadius: 99, transition: 'width 0.8s ease' }} />
            </div>
          </div>

          {/* ── Quick actions ── */}
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 16 }}>
            <div className="fw-bold mb-3" style={{ fontFamily: "'Syne', sans-serif", color: '#0d1f1c' }}>Quick Actions</div>
            <div className="row g-3">
              <QuickBtn icon="fa-plus-circle"  label="Create Program"    color={C.teal}  onClick={() => navigate('/dashboard/program-manager/create')} />
              <QuickBtn icon="fa-list"         label="All Programs"      color={C.blue}  onClick={() => navigate('/dashboard/program-manager/programs')} />
              <QuickBtn icon="fa-chart-bar"    label="Training Reports"  color={C.amber} onClick={() => navigate('/dashboard/program-manager/reports')} />
              <QuickBtn icon="fa-user-check"   label="Manage Enrollments" color={C.green} onClick={() => navigate('/dashboard/program-manager/programs')} />
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
};

export default ProgramManagerDashboard;
