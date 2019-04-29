import React, { Component } from 'react';

import { generate } from 'shortid';

import randomize from '../../utils/random';
import randomizeExclude from '../../utils/randomize-exlcude';
import clamp from '../../utils/clamp';

import {
  SEASONS,
  DAILY_SALARY,
  DAILY_COSTS,
  BASE_TAX_RATE,
  TICK_RATES,
  LENDERS,
  DAYS_IN_SEASON,
  TAXABLE_POPULATION,
} from '../../data/constants';

import kings from '../../data/kings';
import actions from '../../data/actions';

import King from '../king';
import Stats from '../stats';
import Action from '../action';
import Tweaks from '../tweaks';
import Loans from '../loans';

const defaultState = {
  kings,
  currentKing: null,
  tickRate: TICK_RATES[2].value,
  affection: 0,
  affinity: {
    nobles: 0,
    people: 0,
  },
  bargaining: 0.00,
  coin: 0,
  unrest: 0,
  population: 0,
  days: 0,
  season: randomize(0, SEASONS.length - 1),
  taxes: BASE_TAX_RATE,
  loans: [],
  initialLoans: [],
  lenders: LENDERS,
  statusMessage: null,
  eventProbability: 0.2,
  timer: null,
  event: {},
  paused: true,
  started: false,
  decision: false,
  firstRequest: true,
  seasonsPassed: 0,
};

class Game extends Component {
  state = defaultState;

  constructor(props) {
    super(props);

    this.startGame = this.startGame.bind(this);
    this.tick = this.tick.bind(this);
    this.renderAction = this.renderAction.bind(this);
    this.startTicking = this.startTicking.bind(this);
    this.stopTicking = this.stopTicking.bind(this);
    this.updateTaxRate = this.updateTaxRate.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.handleLoanPayment = this.handleLoanPayment.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.resign = this.resign.bind(this);
  }

  componentWillMount() {
    const { currentKing } = this.state;

    this.setKing(currentKing);
  }

  setKing(currentKing = null) {
    let currentStateObject = this.state;

    if (currentKing === null) {
      currentStateObject = defaultState;
    }

    const { kings, coin, loans: oldLoans, initialLoans: oldInitialLoans } = currentStateObject;

    const ignoreKings = [];

    if (currentKing !== null) {
      ignoreKings.push(currentKing);
    }

    const newKing = randomizeExclude(0, kings.length - 1, ignoreKings);

    const {
      affinity,
      affection,
      lenders,
      loans: newLoans,
    } = kings[newKing].defaults;

    const originatedLoans = newLoans.map(({ origination, ...loan}) => {
      return {
        origination: currentStateObject.days,
        ...loan,
      };
    });

    const stateObject = {
      affinity,
      affection,
      currentKing: newKing,
      lenders: Array.concat(defaultState.lenders, lenders),
      coin: coin + kings[newKing].defaults.coin + newLoans.reduce((loanAmount, loan) => loanAmount + loan.amount, 0),
      loans: Array.concat(oldLoans, originatedLoans),
      initialLoans: Array.concat(oldInitialLoans, newLoans),
      bargaining: kings[newKing].defaults.bargaining,
    };

    if (currentKing === null) {
      const {
        population,
        unrest,
        taxes,
      } = kings[newKing].defaults;

      stateObject.population = population;
      stateObject.unrest = unrest;
      stateObject.taxes = taxes;
    }

    this.setState(stateObject);
  }

  increaseDays(daysToAdd = 1) {
    const { days } = this.state;

    this.setState({
      days: days + daysToAdd,
    });
  }

  updateTaxRate(e) {
    const { target } = e;

    const isValidTaxRate = typeof target.value === 'number';

    if (isValidTaxRate) {
      this.setState({
        taxes: newTaxRate,
      });
    }
  }

  updateTickRate(e) {
    const { target } = e;

    if (TICK_RATES.includes(target.value)) {
      this.setState({
        tickRate: target.value,
      });
    }
  }

  startTicking() {
    const { paused, tickRate } = this.state;

    const timer = setInterval(this.tick, tickRate);

    this.setState({
      timer,
      paused: !paused,
    });
  }

  stopTicking() {
    const { timer, paused } = this.state;

    if (timer) {
      clearInterval(timer);

      this.setState({
        timer: null,
        paused: !paused,
      });
    }
  }

  startGame(value) {
    if (value === 0) {
      this.setState({
        statusMessage: (
          <div>
            <p>Refusing the King's appointment is tantamount to treason. You'll spend the rest of your days in the dungeons.</p>
            <button type="button" onClick={this.resetGame}>Reset</button>
          </div>
        )
      });
    } else {
      this.setState({
        started: true,
        decision: false,
        event: {},
      });

      this.increaseDays();

      this.startTicking();
    }
  }

  resign() {
    this.stopTicking();

    this.setState({
      statusMessage: (
        <div>
          <p>Resigning as Master of Coin without being dismissed is tantamount to treason. You'll spend the rest of your days in the dungeons.</p>
          <button type="button" onClick={this.resetGame}>Reset</button>
        </div>
      )
    });
  }

  checkSeason(days, season) {
    const { seasonsPassed } = this.state;

    let newSeason = season;

    if (days - seasonsPassed * DAYS_IN_SEASON >= DAYS_IN_SEASON) {
      newSeason = newSeason + 1;
    }

    if (newSeason > SEASONS.length - 1) {
      newSeason = 0;
    }

    return newSeason;
  }

  resetGame() {
    this.stopTicking();

    this.setState(defaultState);

    this.setKing(null);
  }

  handleLoanPayment(paymentInfo) {
    const {
      id,
      amount,
    } = paymentInfo;

    const { loans, coin } = this.state;

    const paidLoanIndex = loans.findIndex((loan) => loan.id === id);

    const newLoans = [...loans];

    newLoans[paidLoanIndex].amount = newLoans[paidLoanIndex].amount - amount;

    if (newLoans[paidLoanIndex].amount === 0) {
      newLoans.splice(paidLoanIndex, 1);
    }

    this.setState({
      loans: newLoans,
      coin: coin - amount,
    });
  }

  handleAction(value) {
    const { days, loans, initialLoans } = this.state;

    const {
      taxRate,
      treasuryAmount,
      loanAmount,
      chosenLender,
      modifiers,
      bargainingAttempts,
      bargained,
      days: daysPassed,
      cost,
    } = value;

    console.log(value);

    // TODO: handle bargaining adjustment to affection here

    const stateObject = {
      decision: false,
      taxes: taxRate,
      coin: this.state.coin - treasuryAmount,
      affection: clamp(this.state.affection + (modifiers.affection || 0), -100, 100),
      affinity: {
        people: clamp(this.state.affinity.people + (modifiers.affinity.people || 0), 0, 100),
        nobles: clamp(this.state.affinity.nobles + (modifiers.affinity.nobles || 0), 0, 100),
      },
      unrest: clamp(this.state.unrest + (modifiers.unrest || 0), 0, 100),
    };

    const parsedLoanAmount = parseInt(loanAmount, 10);

    if (parsedLoanAmount > 0 && chosenLender) {
      const [ lenderId, loanRate ] = chosenLender.split(':');

      const newLoan = {
        id: generate(),
        amount: parsedLoanAmount,
        lender: parseInt(lenderId, 10),
        rate: parseFloat(loanRate),
        origination: days,
      };

      const newLoans = [...loans];
      const newInitialLoans = [...initialLoans];

      newLoans.push(newLoan);
      newInitialLoans.push(newLoan);

      stateObject.loans = newLoans;
      stateObject.initialLoans = newInitialLoans;

      // handle loan overages by adding them to the treasury
      if (parsedLoanAmount > cost) {
        stateObject.coin = stateObject.coin + parsedLoanAmount - cost;
      }
    }

    this.setState(stateObject, this.tick(daysPassed, true, this.startTicking));
  }

  tick(daysPassed = 1, skipEvent = false, callback) {
    const {
      population,
      season,
      taxes,
      coin,
      eventProbability,
      unrest,
      days,
      firstRequest,
      loans,
      seasonsPassed,
    } = this.state;

    // TODO: handle checking for affection and affinity failures here

    if (!skipEvent && Math.random() <= eventProbability) {
      this.stopTicking();

      const stateObject = {
        eventProbability: 0.10,
        decision: true,
      };

      if (firstRequest) {
        stateObject.firstRequest = !firstRequest;

        stateObject.event = {
          action: actions[1],
          handler: this.handleAction,
        };
      } else {
        stateObject.event = {
          action: actions[randomize(2, actions.length - 1)],
          handler: this.handleAction,
        }
      }

      this.setState(stateObject);
    } else {
      let populationChange;
      let newPopulation = population;
      let taxesPaid;
      let costsIncurred;
      let newCoinAmount = coin;
      let newUnrest = unrest;
      let previousCoinAmount = coin;
      let loansWithInterest = [...loans];
      let newSeason = season;
      let daysToProcess = daysPassed;

      while(daysToProcess > 0) {
        newSeason = this.checkSeason(days + 1, season);

        populationChange = newPopulation * SEASONS[newSeason].growth;

        newPopulation = Math.floor(newPopulation + populationChange);

        taxesPaid = Math.floor(newPopulation * TAXABLE_POPULATION[newSeason] * DAILY_SALARY * taxes);

        // modify tax income passed on days spent
        // working on current event
        if (daysPassed > 10) {
          taxesPaid = taxesPaid * 0.75;
        } else if (daysPassed > 30) {
          taxesPaid = taxesPaid * 0.50;
        } else if (daysPassed > 45) {
          taxesPaid = taxesPaid * 0.25;
        } else if (daysPassed > 60) {
          taxesPaid = taxesPaid * 0.10;
        }

        costsIncurred = Math.floor(newPopulation * DAILY_COSTS);

        loansWithInterest = loansWithInterest.map((loan) => {
          let amount = Math.floor(loan.amount + loan.amount * loan.rate);

          return {
            id: loan.id,
            amount,
            rate: loan.rate,
            lender: loan.lender,
            origination: loan.origination,
          };
        });

        newCoinAmount = newCoinAmount + taxesPaid - costsIncurred;

        const unrestDifference = (newCoinAmount > previousCoinAmount) ? -0.2 : 0.2;

        if (taxes > BASE_TAX_RATE) {
          unrestDifference = unrestDifference + 2 * taxes - BASE_TAX_RATE;
        } else if(taxes < BASE_TAX_RATE) {
          unrestDifference = unrestDifference + 1 * BASE_TAX_RATE - taxes;
        }

        newUnrest = newUnrest + unrestDifference;

        daysToProcess--;
      }

      this.setState({
        coin: newCoinAmount,
        population: newPopulation,
        eventProbability: eventProbability + 0.025,
        unrest: newUnrest,
        days: days + daysPassed,
        loans: loansWithInterest,
        decision: false,
        event: {},
        season: newSeason,
        seasonsPassed: (newSeason !== season) ? seasonsPassed + 1 : seasonsPassed,
      });

      if (typeof callback === 'function') {
        callback();
      }
    }
  }

  play() {
    const {
      days,
    } = this.state;

    if (days === 0) {
      return this.renderAction(actions[days], this.startGame);
    }

    return null;
  }

  renderAction(actionProps, handler) {
    const { currentKing, ...state } = this.state;

    let finalActionProps = actionProps;

    if (actionProps.kings && actionProps.kings.length && actionProps.kings[currentKing]) {
      finalActionProps = actionProps.kings[currentKing];
    }

    return (
      <Action returnValue={handler} {...finalActionProps} {...state} />
    );
  }

  render() {
    const {
      kings,
      currentKing,
      statusMessage,
      event,
      paused,
      started,
      decision,
      tickRate,
      ...state
    } = this.state;

    return (
      <div>
        <King king={kings[currentKing]} />
        {!statusMessage && started && !decision && <Tweaks paused={paused} taxes={state.taxes} tickRate={tickRate} onChangeTaxRate={this.changeTaxRate} onChangeTickRate={this.changeTickRate} onPause={this.stopTicking} onPlay={this.startTicking} onResign={this.resign} />}
        {!statusMessage && started && <Loans coin={state.coin} loans={state.loans} lenders={state.lenders} initialLoans={state.initialLoans} onPayment={this.handleLoanPayment} />}
        {!statusMessage && started && <Stats {...state} />}
        {!statusMessage && event && event.action && this.renderAction(event.action, event.handler)}
        {(statusMessage) ? statusMessage : this.play()}
      </div>
    )
  }
};

export default Game;
