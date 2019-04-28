export const VERY_FAST_TICK_RATE = 100;
export const FAST_TICK_RATE = 500;
export const BASE_TICK_RATE = 1250;
export const SLOW_TICK_RATE = 2500;
export const VERY_SLOW_TICK_RATE = 5000;

export const TICK_RATES = [
  {
    label: 'Very Fast',
    value: VERY_FAST_TICK_RATE,
  },
  {
    label: 'Fast',
    value: FAST_TICK_RATE,
  },
  {
    label: 'Normal',
    value: BASE_TICK_RATE,
  },
  {
    label: 'Slow',
    value: SLOW_TICK_RATE,
  },
  {
    label: 'Very Slow',
    value: VERY_SLOW_TICK_RATE,
  },
];

export const DAYS_IN_SEASON = 90;

export const BASE_TAX_RATE = 0.01;

export const BASE_POPULATION = 500000;

export const POPULATION_VARIANCE = 0.025;

export const SEASONS = [
  {
    label: 'Fall',
    growth: 0.00001,
  },
  {
    label: 'Winter',
    growth: -0.001,
  },
  {
    label: 'Spring',
    growth: 0.00001,
  },
  {
    label: 'Summer',
    growth: 0.001,
  },
];

export const LENDERS = [
  {
    name: 'Bank of Lead',
    maxLoans: 10,
    maxDebt: BASE_POPULATION * 2,
    rate: {
      low: 0.025,
      med: 0.05,
      high: 0.075,
    },
  },
  {
    name: 'Noble Houses',
    maxLoans: 5,
    maxDebt: BASE_POPULATION / 2,
    rate: {
      low: 0.00,
      med: 0.01,
      high: 0.0525,
    },
  },
];

export const DAYS_IN_YEAR = DAYS_IN_SEASON * SEASONS.length;

export const DAILY_SALARY = DAYS_IN_YEAR / 2 / DAYS_IN_YEAR;

export const DAILY_COSTS = 0.0001;
