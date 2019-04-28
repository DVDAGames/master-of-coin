import React, { Component } from 'react';

import Option from '../option';

class Action extends Component {
  constructor(props) {
    super(props);

    this.handleChoice = this.handleChoice.bind(this);
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
      </article>
    );
  }
}

export default Action;
