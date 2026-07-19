import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import courseService from '../../api/courseService';
import studentService from '../../api/studentService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { format } from 'date-fns';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCourseDetails();
  }, [id]);

  const loadCourseDetails = async () => {
    setLoading(true);
    try {
      const [courseResponse, studentsResponse] = await Promise.all([
        courseService.getById(id),
        studentService.getByCourse(id),
      ]);

      if (courseResponse.success) {
        setCourse(courseResponse.data);
      }

      if (studentsResponse.success) {
        setStudents(studentsResponse.data);
      }
    } catch (err) {
      setError('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseService.delete(id);
        navigate('/courses');
      } catch (err) {
        alert('Failed to delete course');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (error || !course) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger">{error || 'Course not found'}</div>
        <Link to="/courses" className="btn btn-primary">
          <i className="bi bi-arrow-left me-2"></i>
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Course Details</h4>
        <div>
          <Link to={`/courses/${id}/edit`} className="btn btn-primary me-2">
            <i className="bi bi-pencil me-2"></i>
            Edit
          </Link>
          <button className="btn btn-danger me-2" onClick={handleDelete}>
            <i className="bi bi-trash me-2"></i>
            Delete
          </button>
          <Link to="/courses" className="btn btn-secondary">
            <i className="bi bi-arrow-left me-2"></i>
            Back
          </Link>
        </div>
      </div>

      <div className="row">
        {/* Course Information */}
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Course Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-12 mb-3">
                  <label className="text-muted small">Course Name</label>
                  <p className="fw-bold fs-5">{course.course_name}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="text-muted small">Duration</label>
                  <p className="fw-bold">{course.duration} months</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="text-muted small">Total Fee</label>
                  <p className="fw-bold text-success">
                    ${Number(course.total_fee)?.toFixed(2)}
                  </p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="text-muted small">Total Students</label>
                  <p className="fw-bold">{students.length}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="text-muted small">Status</label>
                  <p className="fw-bold">
                    <span className={`badge bg-${course.status === 1 ? 'success' : 'danger'}`}>
                      {course.status === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
                <div className="col-12">
                  <label className="text-muted small">Created At</label>
                  <p className="fw-bold">
                    {format(new Date(course.created_at), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Quick Statistics</h5>
            </div>
            <div className="card-body">
              <div className="text-center mb-3">
                <div className="display-4 fw-bold text-primary">{students.length}</div>
                <div className="text-muted">Total Students Enrolled</div>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <div>
                  <div className="fw-bold text-success">
                    {students.filter(s => s.status === 1).length}
                  </div>
                  <div className="text-muted small">Active</div>
                </div>
                <div>
                  <div className="fw-bold text-danger">
                    {students.filter(s => s.status === 0).length}
                  </div>
                  <div className="text-muted small">Inactive</div>
                </div>
                <div>
                  <div className="fw-bold text-info">
                    {students.filter(s => s.admissions?.[0]?.payment_status === 'paid').length}
                  </div>
                  <div className="text-muted small">Paid</div>
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
                to={`/admissions/create?course=${id}`} 
                className="btn btn-success w-100 mb-2"
              >
                <i className="bi bi-person-plus me-2"></i>
                Add Student
              </Link>
              <button 
                className="btn btn-outline-primary w-100"
                onClick={() => window.print()}
              >
                <i className="bi bi-printer me-2"></i>
                Print Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Students */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Enrolled Students</h5>
            </div>
            <div className="card-body">
              {students.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-people fs-1 text-muted d-block mb-2"></i>
                  <p className="text-muted">No students enrolled in this course</p>
                  <Link to={`/admissions/create?course=${id}`} className="btn btn-primary">
                    <i className="bi bi-plus-circle me-2"></i>
                    Enroll First Student
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Admission Date</th>
                        <th>Payment Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id}>
                          <td>{student.full_name}</td>
                          <td>{student.email}</td>
                          <td>{student.mobile}</td>
                          <td>
                            {student.admissions?.[0]?.admission_date && 
                              format(new Date(student.admissions[0].admission_date), 'MMM dd, yyyy')
                            }
                          </td>
                          <td>
                            <span className={`badge bg-${
                              student.admissions?.[0]?.payment_status === 'paid' ? 'success' :
                              student.admissions?.[0]?.payment_status === 'partial' ? 'warning' :
                              'danger'
                            }`}>
                              {student.admissions?.[0]?.payment_status || 'N/A'}
                            </span>
                          </td>
                          <td>
                            <Link 
                              to={`/students/${student.id}`}
                              className="btn btn-sm btn-outline-info me-1"
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

export default CourseDetails;