import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRole } from '../../utils/tokenStorage';

const OfficerDashboardRouteFix = ({ setTabFromPath, children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location?.pathname || '';
  
    if (!setTabFromPath) return;

    if (path.includes('/applications')) setTabFromPath('applications');
    else if (path.includes('/placements')) setTabFromPath('placements');
    else if (path.includes('/employers')) setTabFromPath('employers');
    else if (path.includes('/jobseekers')) setTabFromPath('jobSeekers');
    else setTabFromPath('jobSeekers');
  }, [location?.pathname, navigate, setTabFromPath]);
  if (getRole() !== 'OFFICER') return children;

  return children;
};

export default OfficerDashboardRouteFix;

