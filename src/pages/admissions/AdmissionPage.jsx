import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdmissions } from '../../hooks/useAdmissions';
import DataTable from '../../components/common/DataTable';
import ConfirmModal from '../../components/common/ConfirmModal';
import { format } from 'date-fns';

const AdmissionPage = () => {
  const {
    admissions,
    loading,
    pagination,
    filters,
    setFilters,
    fetchAdmissions,
    searchAdmissions,
    deleteAdmission,
  } = useAdmissions();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);

  const columns = [
    {
      field: 'student_name',
      header: 'Student',
      render: (item) => (
        <Link to={`/students/${item.student_id}`} className="text-decoration-none">
          {item.student?.full_name}
        </Link>
      ),
    },
    {
      field: 'course_name',
      header: 'Course',
      render: (item) => (
        <Link to={`/courses/${item.course_id}`} className="text-decoration-none">
          {item.course?.course_name}
        </Link>
      ),
    },
    {
      field: 'admission_date',
      header: 'Admission Date',
      render: (item) => format(new Date(item.admission_date), 'MMM dd, yyyy'),
    },
    {
      field: 'total_fee_formatted',
      header: 'Total Fee',
    },
    {
      field: 'amount_paid_formatted',
      header: 'Amount Paid',
    },
    {
      field: 'balance_fee_formatted',
      header: 'Balance',
    },
    {
      field: 'payment_status',
      header: 'Status',
      render: (item) => (
        <span className={`badge bg-${item.payment_status === 'paid' ? 'success' : item.payment_status === 'partial' ? 'warning' : 'danger'}`}>
          {item.payment_status}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: 'View',
      icon: 'bi-eye',
      variant: 'info',
      onClick: (item) => window.location.href = `/admissions/${item.id}`,
    },
    {
      label: 'Edit',
      icon: 'bi-pencil',
      variant: 'primary',
      onClick: (item) => window.location.href = `/admissions/${item.id}/edit`,
    },
    // {
    //   label: 'Pay',
    //   icon: 'bi-currency-dollar',
    //   variant: 'success',
    //   onClick: (item) => {
    //     const amount = prompt('Enter payment amount:');
    //     if (amount && parseFloat(amount) > 0) {
    //       // Call payFee function
    //     }
    //   },
    // },
    {
      label: 'Delete',
      icon: 'bi-trash',
      variant: 'danger',
      onClick: (item) => {
        setSelectedAdmission(item);
        setShowDeleteModal(true);
      },
    },
  ];

  const handleDelete = async () => {
    if (selectedAdmission) {
      await deleteAdmission(selectedAdmission.id);
      setShowDeleteModal(false);
      setSelectedAdmission(null);
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Admissions</h4>
        <Link to="/admissions/create" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          New Admission
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={admissions}
        loading={loading}
        pagination={pagination}
        onSearch={searchAdmissions}
        onPageChange={(page) => fetchAdmissions(page)}
        actions={actions}
      >
        <div className="d-flex gap-2">
          <select
            className="form-select w-auto"
            onChange={(e) => setFilters({ ...filters, payment_status: e.target.value })}
            value={filters.payment_status || ''}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </DataTable>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Admission"
        message={`Are you sure you want to delete this admission? This action cannot be undone.`}
        confirmText="Delete Admission"
        confirmVariant="danger"
      />
    </div>
  );
};

export default AdmissionPage;