import React from 'react';

const EmptyState = ({ 
  icon = 'bi-inbox', 
  title = 'No Data Found', 
  message = 'There is no data to display.',
  actionText,
  onAction,
}) => {
  return (
    <div className="text-center py-5">
      <i className={`bi ${icon} fs-1 text-muted mb-3 d-block`}></i>
      <h4 className="text-muted">{title}</h4>
      <p className="text-muted">{message}</p>
      {actionText && onAction && (
        <button className="btn btn-primary mt-3" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;