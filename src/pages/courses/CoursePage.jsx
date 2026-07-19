import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourses } from '../../hooks/useCourses';
import DataTable from '../../components/common/DataTable';
import ConfirmModal from '../../components/common/ConfirmModal';

const CoursePage = () => {
  const {
    courses,
    loading,
    pagination,
    filters,
    setFilters,
    fetchCourses,
    searchCourses,
    deleteCourse,
    toggleStatus,
  } = useCourses();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const columns = [
    {
      field: 'course_name',
      header: 'Course Name',
      sortable: true,
      render: (item) => (
        <Link to={`/courses/${item.id}`} className="text-decoration-none fw-bold">
          {item.course_name}
        </Link>
      ),
    },
    {
      field: 'duration',
      header: 'Duration',
      render: (item) => `${item.duration} months`,
    },
    {
      field: 'total_fee_formatted',
      header: 'Total Fee',
      sortable: true,
    },
    {
      field: 'students_count',
      header: 'Students',
      render: (item) => item.students_count || 0,
    },
    {
      field: 'status',
      header: 'Status',
      render: (item) => (
        <span className={`badge bg-${item.status === 1 ? 'success' : 'danger'}`}>
          {item.status === 1 ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: 'Edit',
      icon: 'bi-pencil',
      variant: 'primary',
      onClick: (item) => window.location.href = `/courses/${item.id}/edit`,
    },
    {
      label: 'Toggle',
      icon: 'bi-arrow-repeat',
      variant: 'warning',
      onClick: (item) => toggleStatus(item.id),
    },
    {
      label: 'Delete',
      icon: 'bi-trash',
      variant: 'danger',
      onClick: (item) => {
        setSelectedCourse(item);
        setShowDeleteModal(true);
      },
    },
  ];

  const handleDelete = async () => {
    if (selectedCourse) {
      await deleteCourse(selectedCourse.id);
      setShowDeleteModal(false);
      setSelectedCourse(null);
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Courses</h4>
        <Link to="/courses/create" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Add New Course
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={courses}
        loading={loading}
        pagination={pagination}
        onSearch={searchCourses}
        onPageChange={(page) => fetchCourses(page)}
        onSort={(field, direction) => setFilters({ ...filters, sort_by: field, sort_direction: direction })}
        actions={actions}
      >
        <select
          className="form-select w-auto"
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          value={filters.status || ''}
        >
          <option value="">All Status</option>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>
      </DataTable>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Course"
        message={`Are you sure you want to delete ${selectedCourse?.course_name}? This action cannot be undone.`}
        confirmText="Delete Course"
        confirmVariant="danger"
      />
    </div>
  );
};

export default CoursePage;