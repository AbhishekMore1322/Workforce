import React from 'react';
import AppLayout from '../../components/AppLayout';
import '../../components/AppLayout.css';

const AdminShell = ({ children }) => (
  <AppLayout pageTitle="Admin Dashboard">{children}</AppLayout>
);

export default AdminShell;

