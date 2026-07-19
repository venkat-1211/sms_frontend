import React from 'react';
import { useFormContext } from 'react-hook-form';

const FormSelect = ({ 
  name, 
  label, 
  options = [], 
  placeholder = 'Select...', 
  required = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      <select
        id={name}
        className={`form-select ${error ? 'is-invalid' : ''} ${className}`}
        disabled={disabled}
        {...register(name)}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <div className="invalid-feedback d-block">
          {error.message}
        </div>
      )}
    </div>
  );
};

export default FormSelect;