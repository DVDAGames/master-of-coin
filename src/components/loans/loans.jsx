import React, { Fragment } from 'react';

const Loans = props => {
  const mapLoans = () => {
    return props.loans
      .sort((a, b) => b.rate - a.rate)
      .map((loan, id) => {
        const initialLoan = props.initialLoans.find((initialLoan) => loan.id === initialLoan.id);

        return (
          <li key={`loan-${loan.id}`}>
            <strong>{props.lenders[loan.lender].name}</strong> {initialLoan.amount} @ {(loan.rate * 100)}% => {loan.amount}
          </li>
        )
      })
    ;
  };

  const renderLoans = () => {
    if (props.loans.length) {
      return (
        <Fragment>
          <h3>Loans</h3>
          <ol>
            {mapLoans()}
          </ol>
        </Fragment>
      );
    }

    return null;
  };

  return (
    <aside>
      {renderLoans()}
    </aside>
  );
};

export default Loans;
