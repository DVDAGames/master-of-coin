import React from 'react';

const King = props => {
  const { king } = props;

  return (
    <h3>Ruler: {king.name}</h3>
  );
};

export default King;
