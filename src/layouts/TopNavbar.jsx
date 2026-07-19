import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const TopNavbar = ({ toggleSidebar, sidebarCollapsed }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top" style={{ height: '60px', zIndex: 999 }}>
      <div className="container-fluid">
        <button 
          className="btn btn-link text-dark"
          onClick={toggleSidebar}
        >
          <i className={`bi ${sidebarCollapsed ? 'bi-list' : 'bi-x'}`}></i>
        </button>

        <div className="d-flex align-items-center ms-auto">
          {/* Theme toggle */}
          <button className="btn btn-link text-dark me-2" onClick={toggleTheme}>
            <i className={`bi ${theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-fill'}`}></i>
          </button>

          {/* User dropdown */}
          <div className="dropdown">
            <button 
              className="btn btn-link text-decoration-none dropdown-toggle d-flex align-items-center"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="rounded-circle me-1"
                  style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                />
              ) : (
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white me-1" 
                     style={{ width: '32px', height: '32px' }}>
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
              <span className="d-none d-sm-inline text-dark">{user?.name}</span>
            </button>
            
            {dropdownOpen && (
              <div className="dropdown-menu dropdown-menu-end show" style={{ position: 'absolute' }}>
                <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <i className="bi bi-person me-2"></i> Profile
                </Link>
                <Link to="/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <i className="bi bi-gear me-2"></i> Settings
                </Link>
                <hr className="dropdown-divider" />
                <button className="dropdown-item text-danger" onClick={() => { 
                  logout(); 
                  setDropdownOpen(false); 
                }}>
                  <i className="bi bi-box-arrow-right me-2"></i> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;