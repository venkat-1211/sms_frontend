import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import Breadcrumb from '../components/layouts/Breadcrumb';

const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={sidebarCollapsed} />
      
      <div className="flex-grow-1" style={{ marginLeft: sidebarCollapsed ? '70px' : '250px', transition: 'margin-left 0.3s' }}>
        <TopNavbar toggleSidebar={toggleSidebar} sidebarCollapsed={sidebarCollapsed} />
        
        <main className="p-4" style={{ marginTop: '60px' }}>
          <Breadcrumb />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;