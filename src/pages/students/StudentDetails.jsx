import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import studentService from '../../api/studentService';
import admissionService from '../../api/admissionService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStudentDetails();
  }, [id]);

  const loadStudentDetails = async () => {
    setLoading(true);
    try {
      const [studentResponse, admissionsResponse] = await Promise.all([
        studentService.getById(id),
        admissionService.getByStudent(id),
      ]);

      if (studentResponse.success) {
        setStudent(studentResponse.data);
      }

      if (admissionsResponse.success) {
        setAdmissions(admissionsResponse.data);
      }
    } catch (err) {
      setError('Failed to load student details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentService.delete(id);
        navigate('/students');
      } catch (err) {
        alert('Failed to delete student');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (error || !student) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger">{error || 'Student not found'}</div>
        <Link to="/students" className="btn btn-primary">
          <i className="bi bi-arrow-left me-2"></i>
          Back to Students
        </Link>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Student Details</h4>
        <div>
          <Link to={`/students/${id}/edit`} className="btn btn-primary me-2">
            <i className="bi bi-pencil me-2"></i>
            Edit
          </Link>
          <button className="btn btn-danger me-2" onClick={handleDelete}>
            <i className="bi bi-trash me-2"></i>
            Delete
          </button>
          <Link to="/students" className="btn btn-secondary">
            <i className="bi bi-arrow-left me-2"></i>
            Back
          </Link>
        </div>
      </div>

      <div className="row">
        {/* Personal Information */}
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Personal Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="text-muted small">Full Name</label>
                  <p className="fw-bold">{student.full_name}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="text-muted small">Email</label>
                  <p className="fw-bold">{student.email}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="text-muted small">Mobile Number</label>
                  <p className="fw-bold">{student.mobile}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="text-muted small">Date of Birth</label>
                  <p className="fw-bold">
                    {format(new Date(student.date_of_birth), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="text-muted small">Gender</label>
                  <p className="fw-bold">
                    <span className={`badge bg-${
                      student.gender === 'male' ? 'info' : 
                      student.gender === 'female' ? 'danger' : 
                      'secondary'
                    }`}>
                      {student.gender}
                    </span>
                  </p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="text-muted small">Status</label>
                  <p className="fw-bold">
                    <span className={`badge bg-${student.status === 1 ? 'success' : 'danger'}`}>
                      {student.status === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
                <div className="col-12 mb-3">
                  <label className="text-muted small">Address</label>
                  <p className="fw-bold">{student.address}</p>
                </div>
                <div className="col-12">
                  <label className="text-muted small">Registered On</label>
                  <p className="fw-bold">
                    {format(new Date(student.created_at), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Image / Quick Stats */}
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Profile</h5>
            </div>
            <div className="card-body text-center">
              <div className="mb-3">
                {student.avatar ? (
                  <img 
                    src={student.avatar} 
                    alt={student.full_name}
                    className="rounded-circle"
                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                  />
                ) : (
                  <div 
                    className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white mx-auto"
                    style={{ width: '120px', height: '120px', fontSize: '48px' }}
                  >
                    {student.full_name.charAt(0)}
                  </div>
                )}
              </div>
              <h5>{student.full_name}</h5>
              <p className="text-muted small">{student.email}</p>
              <div className="d-flex justify-content-around mt-3">
                <div>
                  <div className="fw-bold">{admissions.length}</div>
                  <div className="text-muted small">Enrollments</div>
                </div>
                <div>
                  <div className="fw-bold">
                    {admissions.filter(a => a.payment_status === 'paid').length}
                  </div>
                  <div className="text-muted small">Paid</div>
                </div>
                <div>
                  <div className="fw-bold">
                    {admissions.filter(a => a.payment_status === 'pending').length}
                  </div>
                  <div className="text-muted small">Pending</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <Link 
                to={`/admissions/create?student=${id}`} 
                className="btn btn-success w-100 mb-2"
              >
                <i className="bi bi-journal-plus me-2"></i>
                New Admission
              </Link>
              <button 
                className="btn btn-outline-primary w-100 mb-2"
                onClick={() => window.print()}
              >
                <i className="bi bi-printer me-2"></i>
                Print Details
              </button>
              <button 
                className="btn btn-outline-secondary w-100"
                onClick={() => navigate('/students')}
              >
                <i className="bi bi-people me-2"></i>
                All Students
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admissions History */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Admissions History</h5>
              <Link to={`/admissions/create?student=${id}`} className="btn btn-sm btn-primary">
                <i className="bi bi-plus-circle me-1"></i>
                Add Admission
              </Link>
            </div>
            <div className="card-body">
              {admissions.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                  <p className="text-muted">No admissions found for this student</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Course</th>
                        <th>Admission Date</th>
                        <th>Total Fee</th>
                        <th>Amount Paid</th>
                        <th>Balance</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admissions.map((admission) => (
                        <tr key={admission.id}>
                          <td>{admission.course?.course_name || 'N/A'}</td>
                          <td>{format(new Date(admission.admission_date), 'MMM dd, yyyy')}</td>
                          <td>${admission.total_fee?.toFixed(2)}</td>
                          <td>${admission.amount_paid?.toFixed(2)}</td>
                          <td>
                            <span className={`fw-bold ${
                              admission.balance_fee > 0 ? 'text-danger' : 'text-success'
                            }`}>
                              ${admission.balance_fee?.toFixed(2)}
                            </span>
                          </td>
                          <td>
                            <span className={`badge bg-${
                              admission.payment_status === 'paid' ? 'success' :
                              admission.payment_status === 'partial' ? 'warning' :
                              'danger'
                            }`}>
                              {admission.payment_status}
                            </span>
                          </td>
                          <td>
                            <Link 
                              to={`/admissions/${admission.id}`}
                              className="btn btn-sm btn-outline-info"
                            >
                              <i className="bi bi-eye"></i>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;