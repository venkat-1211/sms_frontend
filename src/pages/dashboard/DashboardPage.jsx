import React from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import StatsCard from '../../components/dashboard/StatsCard';
import StatsCardEnhanced from '../../components/dashboard/StatsCardEnhanced';
import RevenueChart from '../../components/dashboard/RevenueChart';
import PaymentDistribution from '../../components/dashboard/PaymentDistribution';
import RecentActivities from '../../components/dashboard/RecentActivities';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DashboardPage = () => {
  const { dashboardData, stats, loading } = useDashboard();

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  const studentStats = stats?.students || {};
  const courseStats = stats?.courses || {};
  const admissionStats = stats?.admissions || {};
  const revenueStats = stats?.revenue || {};

  const statsCards = [
    {
      title: 'Total Students',
      value: studentStats.total || 0,
      icon: 'bi-people-fill',
      color: 'primary',
      change: '+12%',
      link: '/students',
      subtitle: `${studentStats.active || 0} active students`,
    },
    {
      title: 'Total Courses',
      value: courseStats.total || 0,
      icon: 'bi-book-fill',
      color: 'success',
      change: '+5%',
      link: '/courses',
      subtitle: `${courseStats.active || 0} active courses`,
    },
    {
      title: 'Total Admissions',
      value: admissionStats.total || 0,
      icon: 'bi-journal-text',
      color: 'info',
      change: '+8%',
      link: '/admissions',
      subtitle: `${admissionStats.paid || 0} paid admissions`,
    },
    {
      title: 'Revenue Generated',
      value: `$${Number(revenueStats.total_revenue || 0).toFixed(2)}`,
      icon: 'bi-currency-dollar',
      color: 'warning',
      change: '+15%',
      link: '/admissions',
      subtitle: `Collection rate: ${revenueStats.collection_rate || 0}%`,
    },
  ];

  const additionalStats = [
    {
      title: 'Pending Fees',
      value: `$${Number(revenueStats.pending_amount || 0).toFixed(2)}`,
      icon: 'bi-clock-history',
      color: 'danger',
      link: '/admissions?payment_status=pending',
    },
    {
      title: 'Male Students',
      value: studentStats.male || 0,
      icon: 'bi-gender-male',
      color: 'primary',
      link: '/students?gender=male',
    },
    {
      title: 'Female Students',
      value: studentStats.female || 0,
      icon: 'bi-gender-female',
      color: 'danger',
      link: '/students?gender=female',
    },
    {
      title: 'Total Fee Value',
      value: `$${Number(courseStats.total_fee || 0).toFixed(2)}`,
      icon: 'bi-cash-stack',
      color: 'success',
      subtitle: `Avg: $${Number(courseStats.avg_fee || 0).toFixed(2)}`,
    },
  ];

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Dashboard</h4>
        <div>
          <button 
            className="btn btn-outline-secondary me-2"
            onClick={() => window.location.reload()}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="row g-3 mb-4">
        {statsCards.map((card, index) => (
          <div key={index} className="col-xl-3 col-lg-4 col-md-6">
            <StatsCardEnhanced {...card} />
          </div>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="row g-3 mb-4">
        {additionalStats.map((card, index) => (
          <div key={index} className="col-xl-3 col-lg-4 col-md-6">
            <StatsCard {...card} />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="row g-3">
        <div className="col-lg-8">
          <RevenueChart data={dashboardData?.monthly_revenue || []} />
        </div>
        <div className="col-lg-4">
          <PaymentDistribution data={dashboardData?.payment_distribution || {}} />
        </div>
      </div>

      {/* Recent Activities */}
      <div className="row g-3 mt-3">
        <div className="col-md-6">
          <RecentActivities 
            title="Recent Students"
            items={dashboardData?.recent_students || []}
            type="student"
            maxItems={5}
          />
        </div>
        <div className="col-md-6">
          <RecentActivities 
            title="Recent Admissions"
            items={dashboardData?.recent_admissions || []}
            type="admission"
            maxItems={5}
          />
        </div>
      </div>

      {/* Popular Courses */}
      {dashboardData?.popular_courses && dashboardData.popular_courses.length > 0 && (
        <div className="row mt-3">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Popular Courses</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  {dashboardData.popular_courses.map((course, index) => (
                    <div key={index} className="col-md-4">
                      <div className="d-flex align-items-center p-3 bg-light rounded">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                          <i className="bi bi-trophy text-primary"></i>
                        </div>
                        <div>
                          <h6 className="mb-0">{course.course_name}</h6>
                          <small className="text-muted">
                            {course.admissions_count || 0} students enrolled
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;