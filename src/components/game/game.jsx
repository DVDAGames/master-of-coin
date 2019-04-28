import React, { Component } from 'react';

import randomize from '../../utils/random';
import randomizeExclude from '../../utils/randomize-exlcude';

import {
  SEASONS,
  DAILY_SALARY,
  DAILY_COSTS,
  BASE_TAX_RATE,
  TICK_RATES,
} from '../../data/constants';

import kings from '../../data/kings';
import actions from '../../data/actions';

import King from '../king';
import Stats from '../stats';
import Action from '../action';
import Tweaks from '../tweaks';

const defaultState = {
  kings,
  currentKing: null,
  tickRate: TICK_RATES[2].value,
  affection: 0,
  affinity: {
    nobles: 0,
    people: 0,
  },
  coin: 0,
  unrest: 0,
  population: 0,
  days: 0,
  season: randomize(0, SEASONS.length - 1),
  taxes: BASE_TAX_RATE,
  loans: [],
  statusMessage: null,
  eventProbability: 0.2,
  timer: null,
  event: {},
  paused: true,
  started: false,
  decision: false,
  firstRequest: true,
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
    this.resetGame = this.resetGame.bind(this);
  }

  componentWillMount() {
    const { currentKing } = this.state;

    this.setKing(currentKing);
  }

  setKing(currentKing) {
    const { kings } = this.state;

    const ignoreKings = [];

    if (currentKing !== null) {
      ignoreKings.push(currentKing);
    }

    const newKing = randomizeExclude(0, kings.length - 1, ignoreKings);

    const {
      affinity,
      affection,
    } = kings[newKing].defaults;

    const stateObject = {
      affinity,
      affection,
      currentKing: newKing,
    };

    if (currentKing === null) {
      const {
        coin,
        population,
        unrest,
        loans,
        taxes,
      } = kings[newKing].defaults;

      stateObject.coin = coin;
      stateObject.population = population;
      stateObject.unrest = unrest;
      stateObject.loans = loans;
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
      });

      this.increaseDays();
      this.startTicking();
    }
  }

  resetGame() {
    console.log('resetting game');
    this.stopTicking();

    this.setState(defaultState);

    this.setKing(null);
  }

  handleAction(value) {
    console.log(value);

    this.startTicking();
  }

  tick(daysPassed = 1) {
    const {
      population,
      season,
      taxes,
      coin,
      eventProbability,
      unrest,
      days,
      firstRequest,
    } = this.state;

    console.log('day:', days);

    if (Math.random() <= eventProbability) {
      const { timer } = this.state;

      clearInterval(timer);

      const stateObject = {
        eventProbability: 0.1,
        timer: null,
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

      while(daysPassed > 0) {
        populationChange = newPopulation * SEASONS[season].growth;

        newPopulation = Math.floor(newPopulation + populationChange);

        taxesPaid = Math.floor(newPopulation * DAILY_SALARY * taxes);

        costsIncurred = Math.floor(newPopulation * DAILY_COSTS);

        newCoinAmount = newCoinAmount + taxesPaid - costsIncurred;

        newUnrest = newUnrest + (newCoinAmount > previousCoinAmount) ? -2 : 2;

        daysPassed--;
      }

      this.setState({
        coin: newCoinAmount,
        population: newPopulation,
        eventProbability: eventProbability + 0.025,
        unrest: newUnrest,
        days: days + daysPassed,
      });
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
    const { currentKing } = this.state;

    let finalActionProps = actionProps;

    if (actionProps.kings && actionProps.kings.length && actionProps.kings[currentKing]) {
      finalActionProps = actionProps.kings[currentKing];
    }

    return (
      <Action returnValue={handler} {...finalActionProps} />
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
        <p>Master of Coin, w/ state.</p>
        <King king={kings[currentKing]} />
        {started && !decision && <Tweaks paused={paused} taxes={state.taxes} tickRate={tickRate} onChangeTaxRate={this.changeTaxRate} onChangeTickRate={this.changeTickRate} onPause={this.stopTicking} onPlay={this.startTicking} onResign={this.resetGame} />}
        {started && <Stats {...state} />}
        {event && event.action && this.renderAction(event.action, event.handler)}
        {(statusMessage) ? statusMessage : this.play()}
      </div>
    )
  }
};

export default Game;
