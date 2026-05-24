import { Navigate } from 'react-router-dom';
import { getRole } from '../../utils/tokenStorage';

const PROGRAM_MANAGER_ROLE = 'PROGRAM_MANAGER';

export const requireProgramManagerRole = (roleOverride) => {
  const role = roleOverride ?? getRole();
  return role === PROGRAM_MANAGER_ROLE;
};

export const ProgramManagerRedirect = ({ children, role }) => {

  if (!requireProgramManagerRole(role)) {
    return null;
  }

  return children;
};


