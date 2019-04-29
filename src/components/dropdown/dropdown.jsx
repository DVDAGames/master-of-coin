import React from 'react';

const Dropdown = props => {
  const {
    name,
    options,
    label,
    ...otherProps
  } = props;

  const renderOptions = () => options.map((option) => (
    <option key={`option-${name}-${option.value}`} value={option.value}>{option.label}</option>
  ));

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <select id={name} name={name} {...otherProps}>
        {renderOptions()}
      </select>
    </div>
  );
};

export default Dropdown;
