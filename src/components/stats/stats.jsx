import React, { Fragment } from 'react';

import { SEASONS, DAYS_IN_YEAR } from '../../data/constants';

const Stats = props => {
  const calculateLoans = () => props.loans.reduce((totalLoans, loan) => totalLoans + loan.amount, 0);

  const calculateCoin = () => props.coin - calculateLoans();

  const calculateTime = () => {
    const yearOrMore = props.days >= DAYS_IN_YEAR;

    const years = Math.floor(props.days / DAYS_IN_YEAR);
    const days = props.days % DAYS_IN_YEAR;

    let yearString = (years === 1) ? 'Year' : 'Years';
    let dayString = (days === 1) ? 'Day' : 'Days';

    if (yearOrMore) {
      return `${years} ${yearString} and ${days} ${dayString}`;
    }

    return `${days} ${dayString}`;
  };

  return (
    <dl>
      <dt>Treasury</dt>
      <dd>{props.coin}</dd>
      {props.loans.length > 0 && <Fragment>
        <dt>Minus Loans</dt>
        <dd>{calculateCoin()}</dd>
      </Fragment>}
      <dt>Population</dt>
      <dd>{props.population}</dd>
      <dt>Season</dt>
      <dd>{SEASONS[props.season].label}</dd>
      <dt>Time in Office</dt>
      <dd>{calculateTime()}</dd>
      <dt>Unrest</dt>
      <dd>{props.unrest}</dd>
      {props.weddings > 0 && <Fragment>
        <dt>Weddings</dt>
        <dd>{props.weddings}</dd>
      </Fragment>}
      <dt>Number of Kings</dt>
      <dd>{props.numberOfKings}</dd>
    </dl>
  );
}

export default Stats;
