import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import '../../components/AppLayout.css';
import DashboardStatCard from './components/DashboardStatCard';

import {
  getAllJobPostings,
  getApplicationsByJob,
  getAllPlacements,
  getEmployerInterviews,
} from '../../api/employerApi';

const EmployerDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    shortlisted: 0,
    scheduledInterviews: 0,
    successfulPlacements: 0,
  });

  useEffect(() => {
    const toArray = (v) => (Array.isArray(v) ? v : []);
    const extractList = (data) => {
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.interviews)) return data.interviews;
      if (Array.isArray(data?.items)) return data.items;
      return [];
    };

    const loadStats = async () => {
      try {
        const employerId = localStorage.getItem('workforce_employerId');
        if (!employerId) return;

        const allJobs = await getAllJobPostings();
        const myJobs = toArray(allJobs).filter(
          (job) => String(job.employerID) === String(employerId)
        );

        const activeJobs = myJobs.filter((job) => job.status === 'OPEN').length;

        // Preserve sequential calls to match existing backend behavior.
        let totalApplications = 0;
        let shortlisted = 0;

        for (const job of myJobs) {
          const jobId = job.jobID;
          if (!jobId) continue;

          const apps = toArray(await getApplicationsByJob(jobId));
          totalApplications += apps.length;
          shortlisted += apps.filter((a) => a.status === 'SHORTLISTED').length;
        }

        const res = await getEmployerInterviews();
        const interviewsList = extractList(res?.data ?? res);
        const scheduledInterviews = interviewsList.filter(
          (i) => i.status === 'SCHEDULED'
        ).length;

        const allPlacements = await getAllPlacements();
        const myPlacements = toArray(allPlacements).filter(
          (p) => String(p.employerID) === String(employerId)
        );

        setStats({
          activeJobs,
          totalApplications,
          shortlisted,
          scheduledInterviews,
          successfulPlacements: myPlacements.length,
        });
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      }
    };

    loadStats();
  }, []);


  return (
    <div className="bg-light min-vh-100">
      <AppLayout pageTitle="Employer Dashboard">
        <div className="container py-4">
 
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm p-4 bg-white">
              <div className="d-flex align-items-center">
                <div
                  className="bg-light p-3 rounded-circle me-4"
                  style={{ color: '#00796b' }}
                >
                  <i className="fas fa-briefcase fa-2x"></i>
                </div>
                <div>
                  <h3 className="fw-bold mb-1">Welcome back, Employer</h3>
                  <p className="text-muted mb-0">
                    Manage your hiring pipeline from one place
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <DashboardStatCard
              title="Active Job Openings"
              value={stats.activeJobs}
              icon="fa-briefcase"
              onClick={() => navigate('/dashboard/employer/jobs')}
            />
          </div>

          <div className="col-md-3">
            <DashboardStatCard
              title="Total Applications"
              value={stats.totalApplications}
              icon="fa-inbox"
              onClick={() => navigate('/dashboard/employer/jobs')}
            />
          </div>

          <div className="col-md-3">
            <DashboardStatCard
              title="Interviews Scheduled"
              value={stats.scheduledInterviews}
              icon="fa-calendar-check"
              onClick={() =>
                navigate('/dashboard/employer/interviews')
              }
            />
          </div>

          <div className="col-md-3">
            <DashboardStatCard
              title="Successful Placements"
              value={stats.successfulPlacements}
              icon="fa-handshake"
              onClick={() =>
                navigate('/dashboard/employer/placements')
              }
            />
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-8">
            <div className="card border-0 shadow-sm p-4 bg-white h-100">
              <h5 className="fw-bold border-bottom pb-3 mb-4">
                <i className="fas fa-bolt text-muted me-2"></i>
                Quick Actions
              </h5>

              <div className="row g-3">
                <div className="col-md-6">
                  <div
                    className="p-3 border rounded d-flex align-items-center cursor-pointer"
                    onClick={() =>
                      navigate('/dashboard/employer/jobs/create')
                    }
                  >
                    <div className="bg-white shadow-sm p-2 rounded me-3">
                      <i className="fas fa-plus small"></i>
                    </div>
                    <span className="fw-semibold">Post New Job</span>
                  </div>
                </div>

                <div className="col-md-6">
                  <div
                    className="p-3 border rounded d-flex align-items-center cursor-pointer"
                    onClick={() =>
                      navigate('/dashboard/employer/jobs')
                    }
                  >
                    <div className="bg-white shadow-sm p-2 rounded me-3">
                      <i className="fas fa-list small"></i>
                    </div>
                    <span className="fw-semibold">View Job Listings</span>
                  </div>
                </div>

                <div className="col-md-6">
                  <div
                    className="p-3 border rounded d-flex align-items-center cursor-pointer"
                    onClick={() =>
                      navigate('/dashboard/employer/interviews')
                    }
                  >
                    <div className="bg-white shadow-sm p-2 rounded me-3">
                      <i className="fas fa-calendar-check small"></i>
                    </div>
                    <span className="fw-semibold">View Interviews</span>
                  </div>
                </div>

                <div className="col-md-6">
                  <div
                    className="p-3 border rounded d-flex align-items-center cursor-pointer"
                    onClick={() =>
                      navigate('/dashboard/employer/placements')
                    }
                  >
                    <div className="bg-white shadow-sm p-2 rounded me-3">
                      <i className="fas fa-map-marker-alt small"></i>
                    </div>
                    <span className="fw-semibold">View Placements</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4 bg-white h-100" style={{ borderRadius: 16 }}>
              <h5 className="fw-bold mb-1" style={{ color: '#00796b' }}>
                <i className="fas fa-route me-2" />Hiring Workflow
              </h5>
              <p className="text-muted small mb-3">Your end-to-end recruitment steps</p>
              <div className="d-flex flex-column gap-2">
                {[
                  { step: 1, icon: 'fa-plus-circle',    label: 'Post a Job' },
                  { step: 2, icon: 'fa-inbox',          label: 'View Applications' },
                  { step: 3, icon: 'fa-check-circle',   label: 'Approve Application' },
                  { step: 4, icon: 'fa-calendar-check', label: 'Schedule Interview' },
                  { step: 5, icon: 'fa-handshake',      label: 'Hire Candidate' },
                ].map(({ step, icon, label }) => (
                  <div key={step} className="d-flex align-items-center gap-3 p-2 rounded" style={{ background: '#f0f7f5' }}>
                    <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold small flex-shrink-0"
                      style={{ width: 28, height: 28, background: '#00796b', color: '#fff', fontSize: '0.72rem' }}>
                      {step}
                    </div>
                    <i className={`fas ${icon} small`} style={{ color: '#00796b', width: 14 }} />
                    <span className="small fw-semibold">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        </div>
      </AppLayout>
    </div>
  );
};

export default EmployerDashboard;
