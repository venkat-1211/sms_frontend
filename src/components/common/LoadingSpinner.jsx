import React from 'react';

const LoadingSpinner = ({ 
  size = '3rem', 
  color = 'primary', 
  message = 'Loading...', 
  fullPage = false 
}) => {
  const spinner = (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <div className={`spinner-border text-${color}`} style={{ width: size, height: size }} role="status">
        <span className="visually-hidden">{message}</span>
      </div>
      {message && <p className="mt-2 text-muted">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
           style={{ backgroundColor: 'rgba(255,255,255,0.8)', zIndex: 9999 }}>
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;