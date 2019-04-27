import React from 'react';

const Option = props => {
  const onClick = () => props.choose(props.value);

  const renderMessage = () => (props.message) ? (<p>{props.message}</p>) : '';

  return (
    <li>
      {renderMessage()}
      <button type="button" onClick={onClick}>
        {props.action}
      </button>
    </li>
  );
};

export default Option;
