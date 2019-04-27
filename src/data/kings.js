import randomize from '../utils/random';

import { BASE_TAX_RATE, BASE_POPULATION, POPULATION_VARIANCE } from './constants';

const POPULATION_CHANGE = BASE_POPULATION * POPULATION_VARIANCE;

const MAX_POPULATION = BASE_POPULATION + POPULATION_CHANGE;

const MIN_POPULATION = BASE_POPULATION - POPULATION_CHANGE;

export default [
  {
    name: 'Roberto Boaratherton',
    defaults: {
      coin: randomize(0, 1500),
      unrest: randomize(5, 15),
      population: randomize(MIN_POPULATION, MAX_POPULATION),
      taxes: BASE_TAX_RATE,
      affinity: {
        people: randomize(75, 90),
        nobles: randomize(40, 60),
      },
      loans: [
        {
          amount: 1000,
          rate: 0.00,
          lender: 1,
        },
      ],
    },
  },
];
