import React from 'react';

import { LENDERS } from '../../data/constants';

const Loans = props => {
  const mapLoans = () => {
    return props.loans
      .sort((a, b) => b.rate - a.rate)
      .map((loan, id) => (
        <li key={`loan-${loan.lender}-${id}`}>
          <strong>{LENDERS[loan.lender].name}</strong> {loan.amount} @ {(loan.rate * 100).toFixed(2)}%
        </li>
      ))
    ;
  };

  return (
    <aside>
      <h3>Loans</h3>
      <ol>
        {mapLoans()}
      </ol>
    </aside>
  );
};

export default Loans;
