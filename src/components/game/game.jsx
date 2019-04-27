import React, { Component } from 'react';

import randomize from '../../utils/random';

import { SEASONS } from '../../data/constants';

import kings from '../../data/kings';
import actions from '../../data/actions';

import King from '../king';
import Stats from '../stats';
import Action from '../action';

const currentKing = 0; // TODO: make this random based on available kings

class Game extends Component {
  state = {
    kings,
    currentKing,
    affinity: {
      nobles: 0,
      people: 0,
    },
    coin: 0,
    unrest: 0,
    population: 0,
    days: 0,
    season: randomize(0, SEASONS.length - 1),
    taxes: 0,
    loans: [],
    statusMessage: null,
  };

  constructor(props) {
    super(props);

    this.startGame = this.startGame.bind(this);
  }

  componentWillMount() {
    const { currentKing, kings } = this.state;

    const {
      affinity,
      coin,
      population,
      unrest,
      loans,
      taxes,
    } = kings[currentKing].defaults;

    this.setState({
      affinity,
      coin,
      population,
      unrest,
      loans,
      taxes,
    });
  }

  increaseDays(daysToAdd = 1) {
    const { days } = this.state;

    this.setState({
      days: days + daysToAdd,
    });
  }

  startGame(value) {
    if (value === 0) {
      this.setState({
        statusMessage: (<p>Refusing the King's appointment is tantamount to treason. You'll spend the rest of your days in the dungeons.</p>)
      });
    } else {
      this.increaseDays();
    }
  }

  handleAction(value) {
    console.log(value);
  }

  play() {
    const { days } = this.state;

    console.log('day:', days);

    if (days === 0) {
      return this.renderAction(actions[days], this.startGame);
    }

    if (days === 1) {
      console.log('Starting Day 1');
      return this.renderAction(actions[days], this.hanldeAction);
    }

    return this.renderAction(actions[1]); // TODO: make this choose random action from list
  }

  renderAction(actionProps, handler) {
    const { currentKing } = this.state;

    let finalActionProps = actionProps;

    if (actionProps.kings && actionProps.kings.length && actionProps.kings[currentKing]) {
      finalActionProps = actionProps.kings[currentKing];
    }

    return (
      <Action returnValue={handler} currentKing={currentKing} {...finalActionProps} />
    );
  }

  render() {
    const {
      kings,
      currentKing,
      statusMessage,
      ...state
    } = this.state;

    return (
      <div>
        <p>Master of Coin, w/ state.</p>
        <King king={kings[currentKing]} />
        <Stats {...state} />
        {(statusMessage) ? statusMessage : this.play()}
      </div>
    )
  }
};

export default Game;
