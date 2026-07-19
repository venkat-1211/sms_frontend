import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStudents } from '../../hooks/useStudents';
import DataTable from '../../components/common/DataTable';
import ConfirmModal from '../../components/common/ConfirmModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { format } from 'date-fns';

const StudentPage = () => {
  const {
    students,
    loading,
    pagination,
    filters,
    setFilters,
    fetchStudents,
    searchStudents,
    deleteStudent,
    toggleStatus,
  } = useStudents();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const columns = [
    {
      field: 'full_name',
      header: 'Full Name',
      sortable: true,
      render: (item) => (
        <Link to={`/students/${item.id}`} className="text-decoration-none fw-bold">
          {item.full_name}
        </Link>
      ),
    },
    {
      field: 'email',
      header: 'Email',
      sortable: true,
    },
    {
      field: 'mobile',
      header: 'Mobile',
    },
    {
      field: 'date_of_birth',
      header: 'Date of Birth',
      render: (item) => format(new Date(item.date_of_birth), 'MMM dd, yyyy'),
    },
    {
      field: 'gender',
      header: 'Gender',
      render: (item) => (
        <span className={`badge bg-${item.gender === 'male' ? 'info' : item.gender === 'female' ? 'danger' : 'secondary'}`}>
          {item.gender}
        </span>
      ),
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
      label: 'View',
      icon: 'bi-eye',
      variant: 'info',
      onClick: (item) => window.location.href = `/students/${item.id}`,
    },
    {
      label: 'Edit',
      icon: 'bi-pencil',
      variant: 'primary',
      onClick: (item) => window.location.href = `/students/${item.id}/edit`,
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
        setSelectedStudent(item);
        setShowDeleteModal(true);
      },
    },
  ];

  const handleDelete = async () => {
    if (selectedStudent) {
      await deleteStudent(selectedStudent.id);
      setShowDeleteModal(false);
      setSelectedStudent(null);
    }
  };

  const handleSort = (field, direction) => {
    setFilters({ ...filters, sort_by: field, sort_direction: direction });
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Students</h4>
        <Link to="/students/create" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Add New Student
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={students}
        loading={loading}
        pagination={pagination}
        onSearch={searchStudents}
        onPageChange={(page) => fetchStudents(page)}
        onSort={handleSort}
        sortField={filters.sort_by}
        sortDirection={filters.sort_direction}
        actions={actions}
      >
        <div className="d-flex gap-2">
          <select
            className="form-select w-auto"
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            value={filters.status || ''}
          >
            <option value="">All Status</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
          <select
            className="form-select w-auto"
            onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
            value={filters.gender || ''}
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </DataTable>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Student"
        message={`Are you sure you want to delete ${selectedStudent?.full_name}? This action cannot be undone.`}
        confirmText="Delete Student"
        confirmVariant="danger"
      />
    </div>
  );
};

export default StudentPage;