import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const breadcrumbMap = {
    'dashboard': 'Dashboard',
    'students': 'Students',
    'courses': 'Courses',
    'admissions': 'Admissions',
    'create': 'Create',
    'edit': 'Edit',
    'profile': 'Profile',
  };

  const getLabel = (segment) => {
    return breadcrumbMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  if (pathnames.length === 0) return null;

  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/">Home</Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          return isLast ? (
            <li key={name} className="breadcrumb-item active" aria-current="page">
              {getLabel(name)}
            </li>
          ) : (
            <li key={name} className="breadcrumb-item">
              <Link to={routeTo}>{getLabel(name)}</Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;