import React from 'react';

const Option = props => {
  const onClick = () => props.choose(props.value);

  return (
    <li>
      <p>{props.message}</p>
      <button type="button" onClick={onClick}>
        {props.action}
      </button>
    </li>
  );
};

export default Option;
