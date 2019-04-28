import React from 'react';

const Input = props => {
  const {
    name,
    value,
    onChange,
    type,
    label,
    ...otherProps
  } = props;

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input type={type || 'text'} id={name} name={name} defaultValue={value} onChange={onChange} {...otherProps} />
    </div>
  );
};

export default Input;
