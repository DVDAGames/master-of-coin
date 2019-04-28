import React, { Component } from 'react';

import Option from '../option';

import Input from '../input';

import Dropdown from '../dropdown';

const getLenderWithLeastLoans = (numberOfLoans) => {
  return Object.keys(numberOfLoans).sort((a, b) => {
    return numberOfLoans[a] - numberOfLoans[b];
  })[0];
};
class Action extends Component {
  constructor(props) {
    super(props);

    this.numberOfLoans = props.lenders.reduce((loanObj, lender, id) => {
      loanObj[id] = 0;

      return loanObj;
    }, {});

    this.debtPerLender = props.lenders.reduce((lenderObj, lender, id) => {
      lenderObj[id] = 0;

      return lenderObj;
    }, {});

    this.updateLoanValue = this.updateLoanValue.bind(this);
    this.handleChoice = this.handleChoice.bind(this);
  }

  componentDidMount() {
    const { loans } = this.props;

    this.numberOfLoans = loans.reduce((loanObj, loan) => {
      const lenderId = loan.lender;

      loanObj[lenderId] = loanObj[lenderId] + 1;

      return loanObj;
    }, this.numberOfLoans);

    this.debtPerLender = loans.reduce((lenderObj, loan) => {
      const lenderId = loan.lender;

      lenderObj[lenderId] = lenderObj[lenderId] + loan.amount;

      return lenderObj;
    }, this.debtPerLender);
  }

  updateLoanValue(e) {
    const { target } = e;

    target.value = Math.ceil(target.value / 1000) * 1000;
  }

  handleChoice(value) {
    const { returnValue } = this.props;

    returnValue(value);
  }

  renderOptions() {
    const { options } = this.props;

    return (
      <ul>
        {options.map(option => <Option key={option.id} {...option} choose={this.handleChoice} /> )}
      </ul>
    );
  }

  renderForm() {
    const { cost, coin, lenders } = this.props;

    const treasuryInputProps = {
      name: 'coin',
      label: 'Spend from the Treasury',
      value: (cost > coin) ? coin : cost,
    };

    const loanInputProps = {
      name: 'loan',
      label: 'Get a Loan',
      value: (cost > coin) ? Math.ceil((cost - coin) / 1000) * 1000 : 0,
      onBlur: this.updateLoanValue,
    };

    if (coin <= 0) {
      treasuryInputProps.disabled = true;
      treasuryInputProps.value = 0;

      loanInputProps.value = Math.ceil(cost / 1000) * 1000;
    }

    const lenderOptions = lenders
      .filter((lender, id) => this.numberOfLoans[id] < lender.maxLoans || lender.maxLoans === 0)
      .filter((lender, id) => this.debtPerLender[id] < lender.maxDebt)
      .map((lender, id) => {
        let rate;

        if (typeof lender.rate === 'number') {
          rate = lender.rate;
        } else {
          const hasHalfOfMaxLoans = lender.maxLoans && this.numberOfLoans[id] >= lender.maxLoans / 2;
          const hasHalfOfMaxDebt = lender.maxDebt && this.debtPerLender[id] >= lender.maxDebt / 2;

          if (hasHalfOfMaxDebt && hasHalfOfMaxLoans) {
            rate = lender.rate.high;
          } else if(hasHalfOfMaxDebt || hasHalfOfMaxLoans) {
            rate = lender.rate.med;
          } else {
            rate = lender.rate.low;
          }
        }

        return {
          label: `${lender.name} @ ${rate * 100}%`,
          value: id,
        }
      })
    ;

    const loanDropdownProps = {
      name: 'lender',
      label: 'Get a Loan from',
      value: getLenderWithLeastLoans(this.numberOfLoans),
      options: lenderOptions,
    };

    return (
      <form noValidate>
        <Input {...treasuryInputProps} />
        <Input {...loanInputProps} />
        <Dropdown {...loanDropdownProps} />
        <p><strong>Interest Rate</strong>: {lenders[getLenderWithLeastLoans(this.numberOfLoans)].rate.med * 100}%</p>
        <button type="submit">Submit Action</button>
      </form>
    )
  }

  render() {
    const { message, options, cost = 0, daysPassed = 1 } = this.props;

    const dayString = (daysPassed > 1) ? 'days' : 'day';

    const details = (
      <p>This will cost <strong>{cost} crowns</strong> and take <strong>{daysPassed} {dayString}</strong>.</p>
    );

    return (
      <article>
        <p>{message}</p>
        {(options && this.renderOptions()) || details}
        {!options && this.renderForm()}
      </article>
    );
  }
}

export default Action;
