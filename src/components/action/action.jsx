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
    const { message } = this.props;

    return (
      <article>
        <p>{message}</p>
        {this.renderOptions()}
      </article>
    )
  }
}

export default Action;
