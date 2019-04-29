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
  transitioningKing: true,
  weddings: 0,
  numberOfKings: 0,
};

class Game extends Component {
  state = defaultState;

  constructor(props) {
    super(props);

    this.startGame = this.startGame.bind(this);
    this.tick = this.tick.bind(this);
    this.finalizeTick = this.finalizeTick.bind(this);
    this.renderAction = this.renderAction.bind(this);
    this.startTicking = this.startTicking.bind(this);
    this.stopTicking = this.stopTicking.bind(this);
    this.updateTaxRate = this.updateTaxRate.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.handleLoanPayment = this.handleLoanPayment.bind(this);
    this.kingTransition = this.kingTransition.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.resign = this.resign.bind(this);
  }

  componentWillMount() {
    const { currentKing } = this.state;

    this.setKing(currentKing);
  }

  setKing(currentKing = null, callback) {
    let currentStateObject = this.state;

    if (currentKing === null) {
      currentStateObject = defaultState;
    }

    const { kings, coin, loans: oldLoans, initialLoans: oldInitialLoans } = currentStateObject;

    const ignoreKings = [];

    if (currentKing !== null || callback === true) {
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
      firstRequest: true,
      currentKing: newKing,
      lenders: Array.concat(defaultState.lenders, lenders),
      coin: coin + kings[newKing].defaults.coin + newLoans.reduce((loanAmount, loan) => loanAmount + loan.amount, 0),
      loans: Array.concat(oldLoans, originatedLoans),
      initialLoans: Array.concat(oldInitialLoans, newLoans),
      bargaining: kings[newKing].defaults.bargaining,
      transitioningKing: false,
    };

    if (currentKing === null || callback === true) {
      const {
        population,
        unrest,
        taxes,
        affinity,
        affection,
      } = kings[newKing].defaults;

      stateObject.population = population;
      stateObject.unrest = unrest;
      stateObject.taxes = taxes;
      stateObject.affinity = affinity;
      stateObject.affection = affection;
      stateObject.numberOfKings = 1;
    }

    this.setState(stateObject, (typeof callback === 'function') ? callback : undefined);
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

  statusMessage(message) {
    const {
      days,
      weddings,
      numberOfKings,
      started,
    } = this.state;

    this.setState({
      statusMessage: (
        <div>
          <p>{message}</p>
          {started && <p>You spent {days} days in office, lived through {weddings} weddings, and served {numberOfKings} kings.</p>}
          <button type="button" onClick={this.resetGame}>Reset</button>
        </div>
      )
    });
  }

  kingTransition(value) {
    if (value === 0) {
      this.statusMessage('Resigning in such a tumultuous time is tantamount to treason. You\'ll spend the rest of your days in the dungeons.');
    } else {
      const { currentKing, numberOfKings } = this.state;

      this.setState({
        decision: false,
        event: {},
        numberOfKings: numberOfKings + 1,
      }, () => {
        this.setKing(currentKing, this.startTicking);
      });
    }
  }

  startGame(value) {
    if (value === 0) {
      this.statusMessage('Refusing this appointment is tantamount to treason. You\'ll spend the rest of your days in the dungeons.');
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

    this.statusMessage('Resigning as Master of Coin without being dismissed is tantamount to treason. You\'ll spend the rest of your days in the dungeons.');
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
    const { currentKing } = this.state;

    const king = currentKing;

    this.stopTicking();

    this.setState(defaultState, () => this.setKing(king, true));
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
    const { days, loans, initialLoans, population } = this.state;

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
      wedding,
    } = value;

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

    if (modifiers.population) {
      stateObject.population = Math.floor(population + modifiers.population * population);
    }

    // adjust affection based on bargaining status
    if (bargained) {
      if (bargainingAttempts === 0) {
        stateObject.affection = clamp(stateObject.affection - ((modifiers.affection || 0) * 0.75), -100, 100);
      } else if (bargainingAttempts === 1) {
        stateObject.affection = clamp(stateObject.affection - ((modifiers.affection || 0) * 0.25), -100, 100);
      }
    }

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

    this.setState(stateObject, this.tick(daysPassed, true, this.startTicking, wedding));
  }

  tick(daysPassed = 1, skipEvent = false, callback, weddingCheck = false) {
    const {
      affection,
      affinity,
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

    const { people, nobles } = affinity;

    const totalLoans = loans.reduce((totalLoans, loan) => totalLoans + loan.amount, 0);

    const totalCoin = coin - totalLoans;

    const tooMuchDebt = ((totalCoin < -250000) || (totalCoin < -100000 && unrest > 50)) && coin < totalLoans * 2 && unrest > 50;

    const tooMuchUnrest = (unrest > 75 && people < 50 && nobles < 50) || (unrest > 50 && people < 10 && nobles < 10);

    const tooLittleAffection = affection < -40;

    const tooLittleAffinity = people < 0 && nobles < 0;

    const peopleRevolt = people < -75;

    const noblesRevolt = nobles < -25;

    const peopleUprising = people <= -99 && nobles < 95;

    const noblesUprising = nobles <= -75 && people < 90;

    const tooLittlePopulation = population < 5000;

    if (tooLittlePopulation) {
      this.stopTicking();

      return this.statusMessage('Plague, famine, and war have taken too much of the population for the kingdom to retain its strength. The remaining survivors have scattered to their keeps in hopes of strengthening their numbers and rekindling the kingdom that once was.');
    }

    if (tooLittleAffection) {
      this.stopTicking();

      return this.statusMessage('The crown has lost faith in your abilities as Master of Coin. You\'ve been relieved of your duties and sent to the dungeons.');
    }

    if (tooMuchUnrest) {
      this.stopTicking();

      return this.statusMessage('The kingdom has fallen into chaos due to massive civil unrest. The various regions and noble houses have seceded and formed their own kingdoms.');
    }

    if (tooMuchDebt) {
      this.stopTicking();

      return this.statusMessage('The kingdom has amassed too much debt and is now insolvent. Your debtors have called in their loans and nobility has lost faith in the crown. You\'ve found yourself in the dungeons.');
    }

    if (tooLittleAffinity && peopleRevolt || peopleUprising) {
      this.stopTicking();

      return this.statusMessage('The people have risen up in rebellion and overthrown the nobility. Heads will roll.');
    }

    if (tooLittleAffinity && noblesRevolt || noblesUprising) {
      this.stopTicking();

      return this.statusMessage('The Noble Houses have banded together in rebellion and removed the current Court from power. You\'ve found yourself locked in the dungeons.');
    }

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
      }, () => this.finalizeTick(weddingCheck, callback));
    }
  }

  finalizeTick(weddingCheck, callback) {
    if (weddingCheck && randomize(1, 20) < 10) {
      const {
        kings,
        currentKing,
        weddings,
      } = this.state;

      const event = {
        action: {
          actionId: 'killedAtWedding',
          message: `Leading the realm is a dangerous business. Unfortunately, ${kings[currentKing].name} met their demise at the recent wedding. You can attempt to retain your position in the transition of leadership, or try to resign.`,
          options: [
            {
              id: 'startGame',
              action: 'Continue as Master of Coin',
              value: 1,
            },
            {
              id: 'quitGame',
              action: 'Resign as Master of Coin',
              value: 0,
            },
          ],
        },
        handler: this.kingTransition,
      };

      this.setState({
        event,
        decision: true,
        transitioningKing: true,
        eventProbability: 0.00,
        weddings: weddings + 1,
      });
    } else if (typeof callback === 'function') {
      callback();
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
      transitioningKing,
      ...state
    } = this.state;

    return (
      <div>
        {!transitioningKing && <King king={kings[currentKing]} />}
        {!statusMessage && started && !decision && !transitioningKing && <Tweaks paused={paused} taxes={state.taxes} tickRate={tickRate} onChangeTaxRate={this.changeTaxRate} onChangeTickRate={this.changeTickRate} onPause={this.stopTicking} onPlay={this.startTicking} onResign={this.resign} />}
        {!statusMessage && started && !transitioningKing && <Loans coin={state.coin} loans={state.loans} lenders={state.lenders} initialLoans={state.initialLoans} onPayment={this.handleLoanPayment} />}
        {!statusMessage && started && !transitioningKing && <Stats {...state} />}
        {!statusMessage && event && event.action && this.renderAction(event.action, event.handler)}
        {(statusMessage) ? statusMessage : this.play()}
      </div>
    )
  }
};

export default Game;
