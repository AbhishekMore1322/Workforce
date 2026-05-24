import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { clearAuthData, getUsername } from '../../../utils/tokenStorage';
import NotificationsDropdown from '../../../components/NotificationsDropdown';
import AppLayout from '../../../components/AppLayout';
import '../../../components/AppLayout.css';

const JobSeekerLayout = ({ children, pageTitle }) => {
  return <AppLayout pageTitle={pageTitle}>{children}</AppLayout>;
};

export default JobSeekerLayout;
