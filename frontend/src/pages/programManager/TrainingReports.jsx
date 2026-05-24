import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { getRole } from '../../utils/tokenStorage';
import { getTrainingReport } from '../../api/programManagerApi';
import { requireProgramManagerRole } from './roleGuard';
import AppLayout from '../../components/AppLayout';

const C = { teal: '#00897b', tealLt: '#e0f2f1', green: '#22c55e', amber: '#f59e0b', blue: '#0ea5e9', red: '#ef4444' };
const fmt = (n) => (n == null ? '—' : Number(n).toLocaleString());
const pct = (n) => `${Number(n || 0).toFixed(1)}%`;

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
        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0d1f1c', lineHeight: 1, fontFamily: "'Syne', sans-serif" }}>{value}</div>
        {sub && <div className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>{sub}</div>}
      </div>
    </div>
  </div>
);

const RateBar = ({ label, value, color }) => (
  <div className="mb-3">
    <div className="d-flex justify-content-between mb-1">
      <span className="small text-muted">{label}</span>
      <span className="small fw-bold" style={{ color }}>{pct(value)}</span>
    </div>
    <div style={{ height: 8, background: '#f0f4f2', borderRadius: 99 }}>
      <div style={{ height: '100%', width: `${Math.min(value, 100)}%`, background: color, borderRadius: 99, transition: 'width 0.6s ease' }} />
    </div>
  </div>
);

const TrainingReports = () => {
  const role = getRole();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!requireProgramManagerRole(role)) { navigate('/login', { replace: true }); return; }
    (async () => {
      try {
        setLoading(true);
        const data = await getTrainingReport();
        setReport(data ?? {});
      } catch (e) {
        setError(e?.message || 'Failed to load training reports.');
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, role]);

  if (loading) return (
    <AppLayout pageTitle="Training Reports">
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 400 }}>
        <div className="text-center">
          <div className="spinner-border mb-3" style={{ color: C.teal }} />
          <div className="text-muted small">Loading report…</div>
        </div>
      </div>
    </AppLayout>
  );

  const r = report || {};
  const totalPrograms   = Number(r.totalPrograms        ?? 0);
  const totalEnroll     = Number(r.totalEnrollments     ?? 0);
  const completed       = Number(r.completedEnrollments ?? 0);
  const active          = Number(r.activeEnrollments    ?? 0);
  const remaining       = Math.max(totalEnroll - completed, 0);
  const completionPct   = totalEnroll > 0 ? (completed / totalEnroll) * 100 : 0;
  const activePct       = totalEnroll > 0 ? (active    / totalEnroll) * 100 : 0;
  const generatedDate   = r.generatedDate ?? new Date().toISOString().slice(0, 10);

  const barData = [
    { name: 'Active',     value: active,    fill: C.amber },
    { name: 'Completed',  value: completed, fill: C.green },
    { name: 'Remaining',  value: remaining, fill: C.blue  },
  ];
  const pieData = [
    { name: 'Completed', value: completed },
    { name: 'Active',    value: active    },
    { name: 'Remaining', value: remaining },
  ];
  const PIE_COLORS = [C.green, C.amber, C.blue];

  const health = completionPct >= 80 ? { label: 'Excellent', color: C.green } : completionPct >= 50 ? { label: 'Moderate', color: C.amber } : { label: 'Needs Attention', color: C.red };

  return (
    <AppLayout pageTitle="Training Reports">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-0" style={{ fontFamily: "'Syne', sans-serif", color: '#0d1f1c' }}>Training Reports</h4>
          <div className="text-muted small">Generated: {String(generatedDate)}</div>
        </div>
        <span className="badge px-3 py-2" style={{ background: C.tealLt, color: C.teal, fontWeight: 700, borderRadius: 20 }}>
          <i className="fas fa-graduation-cap me-1" /> Program Manager View
        </span>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      {/* KPI row */}
      <div className="row g-3 mb-4">
        <KPI label="Total Programs"   value={fmt(totalPrograms)} icon="fa-book"         color={C.teal}  sub="All programs" />
        <KPI label="Total Enrollments" value={fmt(totalEnroll)}  icon="fa-users"        color={C.blue}  sub="Across all programs" />
        <KPI label="Active"           value={fmt(active)}        icon="fa-play-circle"  color={C.amber} sub="In progress" />
        <KPI label="Completed"        value={fmt(completed)}     icon="fa-check-double" color={C.green} sub="Finished" />
      </div>

      {/* Charts + rates */}
      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 16, overflow: 'hidden' }}>
        <div className="d-flex align-items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid #f0f4f2', background: '#fafcfb' }}>
          <div className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 34, height: 34, background: C.teal + '18', color: C.teal }}>
            <i className="fas fa-chart-bar" />
          </div>
          <h6 className="fw-bold mb-0" style={{ fontFamily: "'Syne', sans-serif" }}>Enrollment Breakdown</h6>
        </div>
        <div className="card-body p-4">
          <div className="row g-4 align-items-center">
            <div className="col-md-5" style={{ height: 220 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={45}>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="col-md-7" style={{ height: 220 }}>
              <ResponsiveContainer>
                <BarChart data={barData} barSize={44}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f2" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {barData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* KPI rates + health */}
      <div className="row g-4">
        <div className="col-md-7">
          <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: 16 }}>
            <div className="fw-bold mb-3" style={{ fontFamily: "'Syne', sans-serif", color: '#0d1f1c' }}>
              <i className="fas fa-chart-line me-2" style={{ color: C.teal }} />KPI Rates
            </div>
            <RateBar label="Completion Rate" value={completionPct} color={C.green} />
            <RateBar label="Active Rate"     value={activePct}     color={C.amber} />
            <RateBar label="Remaining Rate"  value={totalEnroll > 0 ? (remaining / totalEnroll) * 100 : 0} color={C.blue} />
          </div>
        </div>
        <div className="col-md-5">
          <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: 16 }}>
            <div className="fw-bold mb-3" style={{ fontFamily: "'Syne', sans-serif", color: '#0d1f1c' }}>
              <i className="fas fa-lightbulb me-2" style={{ color: C.amber }} />Insights
            </div>
            <div className="d-flex align-items-center gap-2 mb-3 p-2 rounded-3" style={{ background: health.color + '12' }}>
              <i className="fas fa-circle-check" style={{ color: health.color }} />
              <span className="fw-bold small" style={{ color: health.color }}>Health: {health.label}</span>
            </div>
            <ul className="text-muted small mb-0" style={{ lineHeight: 2 }}>
              <li>{completed} of {totalEnroll} enrollments completed</li>
              <li>{active} participants currently active</li>
              <li>{totalPrograms} total training programs</li>
              {completionPct < 50 && <li className="text-danger fw-semibold">⚠ Review active programs to reduce drop-off</li>}
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default TrainingReports;
