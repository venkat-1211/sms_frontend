import React from 'react';
import { useFormContext } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const FormDatePicker = ({ 
  name, 
  label, 
  required = false,
  disabled = false,
  className = '',
  placeholderText = 'Select date',
  maxDate = null,
  minDate = null,
  ...props 
}) => {
  const { setValue, watch, formState: { errors } } = useFormContext();
  const value = watch(name);
  const error = errors[name];

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      <DatePicker
        id={name}
        className={`form-control ${error ? 'is-invalid' : ''} ${className}`}
        selected={value}
        onChange={(date) => setValue(name, date)}
        placeholderText={placeholderText}
        disabled={disabled}
        dateFormat="yyyy-MM-dd"
        maxDate={maxDate}
        minDate={minDate}
        showYearDropdown
        showMonthDropdown
        dropdownMode="select"
        {...props}
      />
      {error && (
        <div className="invalid-feedback d-block">
          {error.message}
        </div>
      )}
    </div>
  );
};

export default FormDatePicker;