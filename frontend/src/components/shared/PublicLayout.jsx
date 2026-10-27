import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';

const PublicLayout = () => {
  return (
    <>
      <PublicNavbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default PublicLayout;