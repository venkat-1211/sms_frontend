import React from 'react';
import { Link } from 'react-router-dom';

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  color = 'primary', 
  change = null,
  link = null,
  subtitle = null,
}) => {
  const getIconColor = () => {
    switch(color) {
      case 'primary': return 'bg-primary';
      case 'success': return 'bg-success';
      case 'warning': return 'bg-warning';
      case 'danger': return 'bg-danger';
      case 'info': return 'bg-info';
      default: return 'bg-primary';
    }
  };

  const getTextColor = () => {
    switch(color) {
      case 'warning': return 'text-dark';
      default: return 'text-white';
    }
  };

  const content = (
    <div className="stats-card card h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h6 className="text-muted text-uppercase small fw-bold mb-2">{title}</h6>
            <h3 className="mb-0">{value}</h3>
            {subtitle && <small className="text-muted">{subtitle}</small>}
            {change && (
              <div className="mt-2">
                <span className={`badge bg-${change.startsWith('+') ? 'success' : 'danger'}`}>
                  {change}
                </span>
                <span className="text-muted ms-2 small">vs last month</span>
              </div>
            )}
          </div>
          <div className={`${getIconColor()} rounded-circle p-3 ${getTextColor()}`}>
            <i className={`bi ${icon} fs-4`}></i>
          </div>
        </div>
        {link && (
          <div className="mt-3">
            <Link to={link} className="text-decoration-none small">
              View Details <i className="bi bi-chevron-right"></i>
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  return content;
};

export default StatsCard;