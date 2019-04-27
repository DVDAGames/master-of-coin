import React from 'react'
import { render } from 'react-dom';

import Game from './components/game';

if (module.hot) {
  module.hot.accept()
}

render(
  <Game />,
  document.getElementById('game'),
);
