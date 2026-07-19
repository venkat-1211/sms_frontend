import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import admissionService from '../../api/admissionService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { format } from 'date-fns';

const AdmissionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [admission, setAdmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    loadAdmissionDetails();
  }, [id]);

  const loadAdmissionDetails = async () => {
    setLoading(true);
    try {
      const response = await admissionService.getById(id);
      if (response.success) {
        setAdmission(response.data);
      } else {
        setError('Failed to load admission details');
      }
    } catch (err) {
      setError('Failed to load admission details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this admission?')) {
      try {
        await admissionService.delete(id);
        navigate('/admissions');
      } catch (err) {
        alert('Failed to delete admission');
      }
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    const amount = parseFloat(paymentAmount);
    
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (amount > admission.balance_fee) {
      alert(`Amount cannot exceed balance fee of $${admission.balance_fee}`);
      return;
    }

    setPaying(true);
    try {
      const response = await admissionService.payFee(id, amount);
      if (response.success) {
        setAdmission(response.data);
        setPaymentAmount('');
        alert('Payment made successfully!');
      }
    } catch (err) {
      alert('Failed to make payment');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (error || !admission) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger">{error || 'Admission not found'}</div>
        <Link to="/admissions" className="btn btn-primary">
          <i className="bi bi-arrow-left me-2"></i>
          Back to Admissions
        </Link>
      </div>
    );
  }

  const paymentProgress = (admission.amount_paid / admission.total_fee) * 100;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Admission Details</h4>
        <div>
          <Link to={`/admissions/${id}/edit`} className="btn btn-primary me-2">
            <i className="bi bi-pencil me-2"></i>
            Edit
          </Link>
          <button className="btn btn-danger me-2" onClick={handleDelete}>
            <i className="bi bi-trash me-2"></i>
            Delete
          </button>
          <Link to="/admissions" className="btn btn-secondary">
            <i className="bi bi-arrow-left me-2"></i>
            Back
          </Link>
        </div>
      </div>

      <div className="row">
        {/* Admission Information */}
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Admission Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="text-muted small">Student</label>
                  <p className="fw-bold">
                    <Link to={`/students/${admission.student_id}`}>
                      {admission.student?.full_name || 'N/A'}
                    </Link>
                  </p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="text-muted small">Course</label>
                  <p className="fw-bold">
                    <Link to={`/courses/${admission.course_id}`}>
                      {admission.course?.course_name || 'N/A'}
                    </Link>
                  </p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="text-muted small">Admission Date</label>
                  <p className="fw-bold">
                    {format(new Date(admission.admission_date), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="text-muted small">Status</label>
                  <p className="fw-bold">
                    <span className={`badge bg-${admission.status === 1 ? 'success' : 'danger'}`}>
                      {admission.status === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
                <div className="col-12">
                  <label className="text-muted small">Created At</label>
                  <p className="fw-bold">
                    {format(new Date(admission.created_at), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Payment Information</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="text-muted small">Total Fee</label>
                <p className="fw-bold fs-5">${admission.total_fee?.toFixed(2)}</p>
              </div>
              <div className="mb-3">
                <label className="text-muted small">Amount Paid</label>
                <p className="fw-bold text-success fs-5">${admission.amount_paid?.toFixed(2)}</p>
              </div>
              <div className="mb-3">
                <label className="text-muted small">Balance Fee</label>
                <p className={`fw-bold fs-5 ${admission.balance_fee > 0 ? 'text-danger' : 'text-success'}`}>
                  ${admission.balance_fee?.toFixed(2)}
                </p>
              </div>
              <div className="mb-3">
                <label className="text-muted small">Payment Status</label>
                <p className="fw-bold">
                  <span className={`badge bg-${
                    admission.payment_status === 'paid' ? 'success' :
                    admission.payment_status === 'partial' ? 'warning' :
                    'danger'
                  } fs-6`}>
                    {admission.payment_status?.toUpperCase()}
                  </span>
                </p>
              </div>

              {/* Payment Progress */}
              <div className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span>Payment Progress</span>
                  <span>{Math.min(100, paymentProgress)}%</span>
                </div>
                <div className="progress" style={{ height: '10px' }}>
                  <div 
                    className={`progress-bar bg-${paymentProgress >= 100 ? 'success' : 'info'}`}
                    style={{ width: `${Math.min(100, paymentProgress)}%` }}
                  ></div>
                </div>
              </div>

              {/* Payment Form */}
              {admission.payment_status !== 'paid' && (
                <form onSubmit={handlePayment} className="mt-3">
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter amount"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      min="0.01"
                      max={admission.balance_fee}
                      step="0.01"
                      required
                    />
                    <button 
                      type="submit" 
                      className="btn btn-success"
                      disabled={paying}
                    >
                      {paying ? (
                        <span className="spinner-border spinner-border-sm"></span>
                      ) : (
                        'Pay'
                      )}
                    </button>
                  </div>
                  <small className="text-muted">
                    Balance: ${admission.balance_fee?.toFixed(2)}
                  </small>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionDetails;