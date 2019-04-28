import React from 'react';

const Checkbox = props => {
  const {
    name,
    value,
    label,
    ...otherProps
  } = props;

  return (
    <div>
      <label htmlFor={name}>
        <input type="checkbox" id={name} name={name} value={value} {...otherProps} />
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
