import React from 'react';

const Dropdown = props => {
  const renderOptions = () => props.options.map((option) => (
    <option key={`option-${props.name}-${option.value}`} value={option.value}>{option.label}</option>
  ));

  return (
    <div>
      <label htmlFor={props.name}>{props.label}</label>
      <select id={props.name} name={props.name} defaultValue={props.value}>
        {renderOptions()}
      </select>
    </div>
  );
};

export default Dropdown;
