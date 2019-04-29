import React, { Component, Fragment } from 'react';

import Input from '../input';

class Loans extends Component {
  state = {
    payments: this.props.loans.reduce((loanObject, loan) => {
      loanObject[loan.id] = 0;

      return loanObject;
    }, {}),
  };

  constructor(props) {
    super(props);

    this.adjustPayment = this.adjustPayment.bind(this);
    this.makePayment = this.makePayment.bind(this);
  }

  adjustPayment(amount, loanId) {
    const { payments } = this.state;

    const newPayments = Object.assign({}, payments, {
      [loanId]: amount
    });

    this.setState({
      payments: newPayments,
    });
  }

  verifyPayment(amount, loanId) {
    const { payments } = this.state;
    const { loans, coin } = this.props;

    let newPayment;

    const loanIndex = loans.findIndex((loan) => loan.id === loanId);

    const loan = loans[loanIndex];

    if (amount > coin && coin < loan.amount) {
      newPayment = {
        [loanId]: coin,
      };
    } else if (amount > loan.amount) {
      newPayment = {
        [loanId]: loan.amount,
      };
    }

    if (newPayment) {
      const newPayments = Object.assign({}, payments, newPayment);

      this.setState({
        payments: newPayments,
      });
    }
  }

  makePayment(loanId) {
    const { onPayment } = this.props;

    if (onPayment) {
      const { payments } = this.state;

      const loanInfo = {
        id: loanId,
        amount: payments[loanId],
      };

      onPayment(loanInfo);
    }
  };

  mapLoans() {
    const { loans, initialLoans, lenders, coin } = this.props;
    const { payments } = this.state;

    return loans
      .sort((a, b) => b.rate - a.rate)
      .map((loan) => {
        const initialLoan = initialLoans.find((initialLoan) => loan.id === initialLoan.id);

        const inputProps = {
          label: 'Payment',
          type: 'number',
          value: payments[loan.id],
          onBlur: (e) => this.verifyPayment(e.target.value, loan.id),
          onChange: (e) => this.adjustPayment(e.target.value, loan.id),
        };

        const buttonProps = {
          type: 'submit',
        };

        if (coin <= 0) {
          inputProps.disabled = true;
          buttonProps.disabled = true;
        }

        return (
          <li key={`loan-${loan.id}`}>
            <form noValidate onSubmit={(e) => { e.preventDefault(); this.makePayment(loan.id); }}>
              <p><strong>{lenders[loan.lender].name}</strong> {initialLoan.amount} ({(loan.rate * 100)}%): {loan.amount}</p>
              <Input {...inputProps} />
              <button {...buttonProps}>Pay</button>
            </form>
          </li>
        )
      })
    ;
  }

  renderLoans() {
    const { loans } = this.props;
    if (loans.length) {
      return (
        <Fragment>
          <h3>Loans</h3>
          <ol>
            {this.mapLoans()}
          </ol>
        </Fragment>
      );
    }

    return null;
  }

  render() {
    return (
      <aside>
        {this.renderLoans()}
      </aside>
    );
  }
}

export default Loans;
