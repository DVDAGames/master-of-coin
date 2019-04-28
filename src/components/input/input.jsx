import React from 'react';

const Input = props => {
  const {
    name,
    onChange,
    type,
    label,
    ...otherProps
  } = props;

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input type={type || 'text'} id={name} name={name} onChange={onChange} {...otherProps} />
    </div>
  );
};

export default Input;
