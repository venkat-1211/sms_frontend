import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const RecentActivities = ({ 
  title = 'Recent Activities', 
  items = [], 
  type = 'student',
  maxItems = 5,
}) => {
  const renderItem = (item, index) => {
    const typeConfig = {
      student: {
        icon: 'bi-person',
        color: 'primary',
        link: `/students/${item.id}`,
        getDescription: (item) => (
          <>
            <strong>{item.full_name}</strong> joined as a student
          </>
        ),
      },
      admission: {
        icon: 'bi-journal-text',
        color: 'success',
        link: `/admissions/${item.id}`,
        getDescription: (item) => (
          <>
            <strong>{item.student?.full_name || 'Student'}</strong> enrolled in{' '}
            <strong>{item.course?.course_name || 'course'}</strong>
          </>
        ),
      },
      course: {
        icon: 'bi-book',
        color: 'info',
        link: `/courses/${item.id}`,
        getDescription: (item) => (
          <>
            New course: <strong>{item.course_name}</strong>
          </>
        ),
      },
    };

    const config = typeConfig[type] || typeConfig.student;

    const getTimeAgo = (date) => {
      try {
        return formatDistanceToNow(new Date(date), { addSuffix: true });
      } catch {
        return 'Recently';
      }
    };

    return (
      <div key={item.id || index} className="d-flex align-items-start border-bottom pb-3 mb-3">
        <div className={`bg-${config.color} bg-opacity-10 rounded-circle p-2 me-3`}>
          <i className={`bi ${config.icon} text-${config.color}`}></i>
        </div>
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              {config.link ? (
                <Link to={config.link} className="text-decoration-none">
                  {config.getDescription(item)}
                </Link>
              ) : (
                config.getDescription(item)
              )}
            </div>
            <small className="text-muted ms-2" style={{ whiteSpace: 'nowrap' }}>
              {getTimeAgo(item.created_at || item.admission_date)}
            </small>
          </div>
          {item.status !== undefined && (
            <div className="mt-1">
              <span className={`badge bg-${item.status === 1 ? 'success' : 'danger'}`}>
                {item.status === 1 ? 'Active' : 'Inactive'}
              </span>
              {item.payment_status && (
                <span className={`badge bg-${
                  item.payment_status === 'paid' ? 'success' :
                  item.payment_status === 'partial' ? 'warning' : 'danger'
                } ms-1`}>
                  {item.payment_status}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const displayItems = items.slice(0, maxItems);

  return (
    <div className="card h-100">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">{title}</h5>
        {items.length > maxItems && (
          <Link to={`/${type}s`} className="text-decoration-none small">
            View All <i className="bi bi-chevron-right"></i>
          </Link>
        )}
      </div>
      <div className="card-body">
        {displayItems.length === 0 ? (
          <div className="text-center text-muted py-4">
            <i className="bi bi-inbox fs-1 d-block mb-2"></i>
            <p>No recent activities</p>
          </div>
        ) : (
          displayItems.map((item, index) => renderItem(item, index))
        )}
      </div>
    </div>
  );
};

export default RecentActivities;