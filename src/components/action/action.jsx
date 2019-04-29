import React, { Component } from 'react';

import randomize from '../../utils/random';

import Option from '../option';
import Input from '../input';
import Dropdown from '../dropdown';

const getNumberOfLoansPerLender = (loans, lenders) => {
  const loanObject = lenders.reduce((loanObj, lender, id) => {
    loanObj[id] = 0;

    return loanObj;
  }, {});

  return loans.reduce((loanObj, loan) => {
    const lenderId = loan.lender;

    loanObj[lenderId] = loanObj[lenderId] + 1;

    return loanObj;
  }, loanObject);
}

const getDebtsPerLender = (loans, lenders) => {
  const loanObject = lenders.reduce((lenderObj, lender, id) => {
    lenderObj[id] = 0;

    return lenderObj;
  }, {});

  return loans.reduce((lenderObj, loan) => {
    const lenderId = loan.lender;

    lenderObj[lenderId] = lenderObj[lenderId] + loan.amount;

    return lenderObj;
  }, loanObject);
}


const getLenderWithLeastLoans = (numberOfLoans) => {
  return Object.keys(numberOfLoans).sort((a, b) => {
    return numberOfLoans[a] - numberOfLoans[b];
  })[0];
};

const getLenderRate = (loans, lenders, id) => {
  let rate;

  const lender = lenders[id];

  if (typeof lender.rate === 'number') {
    rate = lender.rate;
  } else {
    const hasHalfOfMaxLoans = lender.maxLoans && getNumberOfLoansPerLender(loans, lenders)[id] >= lender.maxLoans / 2;
    const hasHalfOfMaxDebt = lender.maxDebt && getDebtsPerLender(loans, lenders)[id] >= lender.maxDebt / 2;

    if (hasHalfOfMaxDebt && hasHalfOfMaxLoans) {
      rate = lender.rate.high;
    } else if(hasHalfOfMaxDebt || hasHalfOfMaxLoans) {
      rate = lender.rate.med;
    } else {
      rate = lender.rate.low;
    }
  }

  return rate;
}
class Action extends Component {
  numberOfLoans = {};
  debtPerLender = {};

  state = {
    bargainingAttempts: 2,
    bargained: false,
    bargainMessage: null,
    cost: this.props.cost,
    loanAmount: (this.props.cost > this.props.coin) ? Math.ceil((this.props.cost - this.props.coin) / 1000) * 1000 : 0,
    treasuryAmount: (this.props.cost > this.props.coin) ? this.props.coin : this.props.cost,
    chosenLender: 0,
    taxRate: this.props.taxes,
    days: this.props.daysPassed,
    modifiers: this.props.modifiers,
  };

  constructor(props) {
    super(props);

    this.updateLoanValue = this.updateLoanValue.bind(this);
    this.handleChoice = this.handleChoice.bind(this);
    this.attemptToBargain = this.attemptToBargain.bind(this);
    this.submitAction = this.submitAction.bind(this);
    this.updateFormState = this.updateFormState.bind(this);
  }

  componentDidMount() {
    const { loans, coin, lenders } = this.props;
    const { cost } = this.state;

    this.numberOfLoans = getNumberOfLoansPerLender(loans, lenders);

    this.debtPerLender = getDebtsPerLender(loans, lenders);

    const lenderId = getLenderWithLeastLoans(this.numberOfLoans);

    const stateObject = {
      chosenLender: `${lenderId}:${getLenderRate(loans, lenders, lenderId)}`,
    };

    if (coin <= 0) {
      stateObject.treasuryAmount = 0;

      stateObject.loanAmount = Math.ceil(cost / 1000) * 1000;
    }

    this.setState({
      stateObject,
    });
  }

  updateLoanValue(e) {
    const { target } = e;

    const loanAmount = Math.ceil(target.value / 1000) * 1000;

    target.value = loanAmount;

    this.setState({
      loanAmount,
    });
  }

  handleChoice(value) {
    const { returnValue } = this.props;

    returnValue(value);
  }

  attemptToBargain() {
    const { bargaining, affection, coin } = this.props;

    const { bargainingAttempts, cost } = this.state;

    const stateObject = {
      bargainingAttempts: bargainingAttempts - 1,
    };

    if (affection > 0 && randomize(1, 100) < affection) {
      const newCost =  Math.floor(cost - cost * bargaining);

      stateObject.cost = newCost;
      stateObject.bargained = true;
      stateObject.bargainMessage = '"You make a good point. We should be more careful with our funds."';

      if (coin <= 0) {
        stateObject.treasuryAmount = 0;
        stateObject.loanAmount = Math.ceil(newCost / 1000) * 1000;
      } else {
        stateObject.treasuryAmount = (newCost > coin) ? coin : newCost;
        stateObject.loanAmount = (newCost > coin) ? Math.ceil((newCost - coin) / 1000) * 1000 : 0
      }
    } else {
      stateObject.bargainMessage = '"You forget your station, my Lord. You are here to serve me as I serve the realm."';
    }

    this.setState(stateObject);
  }

  updateFormState(e) {
    const { target } = e;

    this.setState({
      [target.name]: target.value
    });
  }

  submitAction(e) {
    e.preventDefault();

    this.handleChoice(this.state);
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
    const {
      coin,
      lenders,
      bargaining,
      affection,
      loans,
      noBargain,
    } = this.props;

    const {
      bargainingAttempts,
      bargained,
      bargainMessage,
      treasuryAmount,
      loanAmount,
      taxRate,
      chosenLender,
    } = this.state;

    const treasuryInputProps = {
      name: 'treasuryAmount',
      label: 'Spend from the Treasury',
      value: treasuryAmount,
      onChange: this.updateFormState,
    };

    const loanInputProps = {
      name: 'loanAmount',
      label: 'Get a Loan',
      value: loanAmount,
      onBlur: this.updateLoanValue,
      onChange: this.updateFormState,
    };

    const lenderOptions = lenders
      .filter((lender, id) => this.numberOfLoans[id] < lender.maxLoans || lender.maxLoans === 0)
      .filter((lender, id) => this.debtPerLender[id] < lender.maxDebt)
      .map((lender, id) => {
        const rate = getLenderRate(loans, lenders, id);

        return {
          label: `${lender.name} @ ${rate * 100}%`,
          value: `${id}:${rate}`,
        };
      })
    ;

    if (coin <= 0) {
      treasuryInputProps.disabled = true;
    }

    const loanDropdownProps = {
      name: 'chosenLender',
      label: 'Get a Loan from',
      value: chosenLender,
      options: lenderOptions,
      onChange: this.updateFormState,
    };

    const taxRateInputProps = {
      type: 'number',
      name: 'taxRate',
      label: 'Adjust Taxes',
      value: taxRate,
      onChange: this.updateFormState,
    };

    const canBargain = !noBargain && !bargained && bargaining !== 0.00 && bargainingAttempts > 0 && affection > 0;

    return (
      <form noValidate autoComplete="off" onSubmit={this.submitAction}>
        {bargainMessage !== null && <p>{bargainMessage}</p>}
        {canBargain && <button type="button" onClick={this.attemptToBargain}>Convince Them to Spend Less</button>}
        <Input {...taxRateInputProps} />
        <Input {...treasuryInputProps} />
        <Input {...loanInputProps} />
        <Dropdown {...loanDropdownProps} />
        <button type="submit">Submit Action</button>
      </form>
    )
  }

  render() {
    const { message, options, daysPassed = 1 } = this.props;

    const { cost } = this.state;

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
