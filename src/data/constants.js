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
    maxDebt: BASE_POPULATION / 2,
  },
  {
    name: 'Noble Houses',
    maxLoans: 0,
    maxDebt: BASE_POPULATION * 2,
  }
];

export const DAYS_IN_YEAR = DAYS_IN_SEASON * SEASONS.length;

export const DAILY_SALARY = DAYS_IN_YEAR / 2 / DAYS_IN_YEAR;

export const DAILY_COSTS = 0.0000001;
