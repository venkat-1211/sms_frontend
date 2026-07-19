import React from 'react';
import { useFormContext } from 'react-hook-form';

const FormInput = ({ 
  name, 
  label, 
  type = 'text', 
  placeholder = '', 
  required = false,
  disabled = false,
  readOnly = false,
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
      <input
        id={name}
        type={type}
        className={`form-control ${error ? 'is-invalid' : ''} ${className}`}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        {...register(name)}
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

export default FormInput;