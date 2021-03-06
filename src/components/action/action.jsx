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
  numberOfLoans = getNumberOfLoansPerLender(this.props.loans, this.props.lenders);
  debtPerLender = getDebtsPerLender(this.props.loans, this.props.lenders);

  state = {
    bargainingAttempts: 2,
    bargained: false,
    bargainMessage: null,
    cost: this.props.cost,
    loanAmount: (this.props.coin <= 0) ? Math.ceil(this.props.cost / 1000) * 1000 : (this.props.cost > this.props.coin) ? Math.ceil((this.props.cost - this.props.coin) / 1000) * 1000 : 0,
    treasuryAmount: (this.props.coin <= 0) ? 0 : (this.props.cost > this.props.coin) ? this.props.coin : this.props.cost,
    chosenLender: `${getLenderWithLeastLoans(this.numberOfLoans)}:${getLenderRate(this.props.loans, this.props.lenders, getLenderWithLeastLoans(this.numberOfLoans))}`,
    taxRate: this.props.taxes,
    days: this.props.daysPassed,
    modifiers: this.props.modifiers,
    wedding: this.props.wedding || false,
  };

  constructor(props) {
    super(props);

    this.updateTreasuryValue = this.updateTreasuryValue.bind(this);
    this.updateLoanValue = this.updateLoanValue.bind(this);
    this.handleChoice = this.handleChoice.bind(this);
    this.attemptToBargain = this.attemptToBargain.bind(this);
    this.submitAction = this.submitAction.bind(this);
    this.updateFormState = this.updateFormState.bind(this);
  }

  componentDidUpdate(previousProps) {
    // if our available coin changes, we need to recalculate our treasuryAmount
    if (previousProps.coin !== this.props.coin) {
      const treasuryAmount = (this.props.coin <= 0) ? 0 : (this.state.cost > this.props.coin) ? this.props.coin : this.state.cost;
      const loanAmount = (treasuryAmount <= 0) ? Math.ceil(this.state.cost / 1000) * 1000 : (this.state.cost > treasuryAmount) ? Math.ceil((this.state.cost - treasuryAmount) / 1000) * 1000 : 0;

      this.setState({
        treasuryAmount,
        loanAmount,
      });
    }
  }

  updateTreasuryValue(e) {
    const { target } = e;

    const { coin } = this.props;
    const { cost } = this.state;

    let treasuryAmount = target.value;

    if (treasuryAmount > cost) {
      treasuryAmount = cost;
    }

    if (treasuryAmount > coin) {
      treasuryAmount = coin;
    }

    this.setState({
      treasuryAmount,
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
      cost,
    } = this.state;

    const treasuryInputProps = {
      name: 'treasuryAmount',
      label: 'Spend from the Treasury',
      value: treasuryAmount,
      onBlur: this.updateTreasuryValue,
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

    const buttonProps = {
      type: 'Submit',
    };

    if (loanAmount + treasuryAmount < cost && coin < treasuryAmount) {
      buttonProps.disabled = true;
    }

    return (
      <form noValidate autoComplete="off" onSubmit={this.submitAction}>
        {bargainMessage !== null && <p>{bargainMessage}</p>}
        {canBargain && <button type="button" onClick={this.attemptToBargain}>Convince Them to Spend Less</button>}
        <Input {...taxRateInputProps} />
        <Input {...treasuryInputProps} />
        <Input {...loanInputProps} />
        <Dropdown {...loanDropdownProps} />
        <button {...buttonProps}>Submit Action</button>
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
