import React from 'react';

import { TICK_RATES } from '../../data/constants';

const Tweaks = props => {
  const pauseButtonText = (props.paused) ? 'Resume' : 'Pause';
  const pauseButtonAction = (props.paused) ? props.onPlay : props.onPause;

  const renderTickRates = (value) => TICK_RATES.map(rate => <option key={`rate-${rate.value}`} value={rate.value}>{rate.label}</option>);

  return (
    <form noValidate>
      <div>
        <button type="button" onClick={pauseButtonAction}>{pauseButtonText}</button>
      </div>
      <div>
        <label htmlFor="tickRate">Speed</label>
        <select id="tickRate" name="tickRate" defaultValue={props.tickRate} onChange={props.onChangeTickRate}>
          {renderTickRates()}
        </select>
      </div>
      <div>
        <button type="button" onClick={props.onResign}>Resign</button>
      </div>
    </form>
  );
};

export default Tweaks;
