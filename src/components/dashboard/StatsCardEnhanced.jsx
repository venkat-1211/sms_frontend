import React from 'react';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';

const StatsCardEnhanced = ({ 
  title, 
  value, 
  icon, 
  color = 'primary', 
  change = null,
  link = null,
  subtitle = null,
  animate = true,
  iconBg = true,
}) => {
  const getColorClasses = () => {
    switch(color) {
      case 'primary': 
        return { bg: 'bg-primary', text: 'text-primary', border: 'border-primary' };
      case 'success': 
        return { bg: 'bg-success', text: 'text-success', border: 'border-success' };
      case 'warning': 
        return { bg: 'bg-warning', text: 'text-warning', border: 'border-warning' };
      case 'danger': 
        return { bg: 'bg-danger', text: 'text-danger', border: 'border-danger' };
      case 'info': 
        return { bg: 'bg-info', text: 'text-info', border: 'border-info' };
      case 'secondary': 
        return { bg: 'bg-secondary', text: 'text-secondary', border: 'border-secondary' };
      default: 
        return { bg: 'bg-primary', text: 'text-primary', border: 'border-primary' };
    }
  };

  const colorClasses = getColorClasses();

  const renderValue = () => {
    if (typeof value === 'string' && value.includes('$')) {
      return value;
    }
    return animate ? (
      <CountUp 
        start={0} 
        end={parseFloat(value) || 0} 
        duration={2} 
        separator="," 
        decimals={typeof value === 'number' && value % 1 !== 0 ? 2 : 0}
      />
    ) : value;
  };

  return (
    <div className={`stats-card card h-100 border-0 shadow-sm hover-shadow ${colorClasses.border} border-start`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h6 className="text-muted text-uppercase small fw-bold mb-2">
              {title}
            </h6>
            <h3 className="mb-0 fw-bold">{renderValue()}</h3>
            {subtitle && (
              <small className="text-muted d-block mt-1">{subtitle}</small>
            )}
            {change && (
              <div className="mt-2 d-flex align-items-center">
                <span className={`badge bg-${change.startsWith('+') ? 'success' : 'danger'} d-flex align-items-center gap-1`}>
                  <i className={`bi bi-${change.startsWith('+') ? 'arrow-up' : 'arrow-down'}`}></i>
                  {change}
                </span>
                <span className="text-muted ms-2 small">vs last month</span>
              </div>
            )}
          </div>
          {iconBg ? (
            <div className={`${colorClasses.bg} bg-opacity-10 rounded-circle p-3 ${colorClasses.text}`}>
              <i className={`bi ${icon} fs-3`}></i>
            </div>
          ) : (
            <i className={`bi ${icon} fs-2 ${colorClasses.text}`}></i>
          )}
        </div>
        {link && (
          <div className="mt-3 pt-2 border-top">
            <Link to={link} className={`text-decoration-none small ${colorClasses.text} d-flex align-items-center`}>
              View Details 
              <i className="bi bi-chevron-right ms-1"></i>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCardEnhanced;