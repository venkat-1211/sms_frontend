import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const DataTable = ({
  columns,
  data,
  loading,
  onSearch,
  onSort,
  sortField,
  sortDirection,
  onPageChange,
  pagination,
  children,
  selectable = false,
  selectedRows = [],
  onSelectRow,
  onSelectAll,
  actions,
}) => {
  const handleSort = (field) => {
    if (onSort) {
      const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
      onSort(field, direction);
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  const isAllSelected = data.length > 0 && selectedRows.length === data.length;

  return (
    <div className="card">
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-md-6">
            {children}
          </div>
          <div className="col-md-6">
            {onSearch && (
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover table-striped table-bordered">
            <thead className="table-light">
              <tr>
                {selectable && (
                  <th style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={isAllSelected}
                      onChange={(e) => onSelectAll?.(e.target.checked)}
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.field}
                    onClick={() => col.sortable && handleSort(col.field)}
                    style={{ 
                      cursor: col.sortable ? 'pointer' : 'default',
                      minWidth: col.minWidth || 'auto',
                      width: col.width || 'auto',
                    }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      {col.header}
                      {col.sortable && getSortIcon(col.field)}
                    </div>
                  </th>
                ))}
                {actions && <th style={{ width: '150px' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)} className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)} className="text-center py-4">
                    <div className="text-muted">
                      <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                      No data available
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={item.id || index}>
                    {selectable && (
                      <td>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedRows.includes(item.id)}
                          onChange={() => onSelectRow?.(item.id)}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.field}>
                        {col.render ? col.render(item, index) : item[col.field]}
                      </td>
                    ))}
                    {actions && (
                      <td>
                        {actions.map((action, idx) => (
                          <button
                            key={idx}
                            className={`btn btn-${action.variant || 'primary'} btn-sm me-1`}
                            onClick={() => action.onClick(item)}
                            title={action.label}
                          >
                            {action.icon && <i className={`bi bi-${action.icon}`}></i>}
                            {action.label}
                          </button>
                        ))}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination && pagination.last_page > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
            <div className="text-muted small">
              Showing {pagination.from || 0} to {pagination.to || 0} of {pagination.total || 0} entries
            </div>
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => onPageChange(pagination.current_page - 1)}>
                    Previous
                  </button>
                </li>
                {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                  const page = pagination.current_page - 2 + i;
                  if (page < 1 || page > pagination.last_page) return null;
                  return (
                    <li key={page} className={`page-item ${page === pagination.current_page ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => onPageChange(page)}>
                        {page}
                      </button>
                    </li>
                  );
                })}
                <li className={`page-item ${pagination.current_page === pagination.last_page ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => onPageChange(pagination.current_page + 1)}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;