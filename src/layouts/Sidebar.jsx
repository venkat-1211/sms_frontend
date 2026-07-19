import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ collapsed }) => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: 'bi-grid-1x2-fill', label: 'Dashboard' },
    { path: '/students', icon: 'bi-people-fill', label: 'Students' },
    { path: '/courses', icon: 'bi-book-fill', label: 'Courses' },
    { path: '/admissions', icon: 'bi-journal-text', label: 'Admissions' },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div 
      className={`bg-dark text-white position-fixed start-0 top-0 h-100 ${collapsed ? 'collapsed' : ''}`}
      style={{ 
        width: collapsed ? '70px' : '250px', 
        transition: 'width 0.3s',
        zIndex: 1000,
        overflowY: 'auto',
      }}
    >
      <div className="d-flex align-items-center justify-content-center p-3 border-bottom border-secondary">
        {!collapsed ? (
          <h5 className="mb-0 text-white fw-bold">
            <i className="bi bi-mortarboard-fill me-2"></i>
            SMS
          </h5>
        ) : (
          <i className="bi bi-mortarboard-fill fs-4"></i>
        )}
      </div>

      <div className="mt-3">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`d-flex align-items-center text-decoration-none px-3 py-2 ${
              isActive(item.path) ? 'bg-primary text-white' : 'text-white-50 hover-bg-secondary'
            }`}
            style={{ 
              transition: 'all 0.2s',
              borderRadius: '4px',
              margin: '2px 8px',
            }}
          >
            <i className={`bi ${item.icon} fs-5`} style={{ minWidth: '24px' }}></i>
            {!collapsed && <span className="ms-2">{item.label}</span>}
          </Link>
        ))}
      </div>

      <div className="position-absolute bottom-0 start-0 w-100 p-3 border-top border-secondary">
        <div className={`d-flex align-items-center ${collapsed ? 'justify-content-center' : ''}`}>
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="rounded-circle"
              style={{ width: '32px', height: '32px', objectFit: 'cover' }}
            />
          ) : (
            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" 
                 style={{ width: '32px', height: '32px' }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
          )}
          {!collapsed && (
            <div className="ms-2 overflow-hidden">
              <div className="text-white small fw-bold text-truncate">{user?.name || 'User'}</div>
              <div className="text-white-50 small text-truncate">{user?.email || ''}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;