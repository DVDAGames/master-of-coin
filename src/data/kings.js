import { generate } from 'shortid';

import randomize from '../utils/random';

import { BASE_TAX_RATE, BASE_POPULATION, POPULATION_VARIANCE, LENDERS } from './constants';

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
      affection: randomize(15, 30),
      affinity: {
        people: randomize(75, 90),
        nobles: randomize(40, 60),
      },
      loans: [
        {
          id: generate(),
          amount: 1000,
          rate: 0.01,
          lender: 1,
          origination: 0,
        },
      ],
      lenders: [
        {
          name: 'Neil Stark',
          maxLoans: 3,
          maxDebt: 10000,
          rate: 0.00,
        },
      ],
      bargaining: 0.50,
    },
  },
  {
    name: 'Christie Sinister',
    defaults: {
      coin: randomize(1000, 10000),
      unrest: randomize(20, 45),
      population: randomize(MIN_POPULATION, MAX_POPULATION),
      taxes: BASE_TAX_RATE,
      affection: randomize(0, 2),
      affinity: {
        people: randomize(1, 10),
        nobles: randomize(1, 10),
      },
      loans: [
        {
          id: generate(),
          amount: 7500,
          rate: 0.05,
          lender: 0,
          origination: 0,
        },
      ],
      lenders: [
        {
          name: 'House Sinister',
          maxLoans: 0,
          maxDebt: 100000,
          rate: 0.00,
        },
      ],
      bargaining: 0.05,
    },
  },
  {
    name: 'Jeffrey Goldenhairathon',
    defaults: {
      coin: randomize(1000, 2500),
      unrest: randomize(50, 75),
      population: randomize(MIN_POPULATION, MAX_POPULATION),
      taxes: BASE_TAX_RATE,
      affection: randomize(0, 0),
      affinity: {
        people: randomize(0, 7),
        nobles: randomize(0, 7),
      },
      loans: [],
      lenders: [
        {
          name: 'House Sinister',
          maxLoans: 0,
          maxDebt: 50000,
          rate: 0.01,
        },
      ],
      bargaining: 0.00,
    },
  },
  {
    name: 'Danielle Targetdragon',
    defaults: {
      coin: randomize(5000, 7500),
      unrest: randomize(25, 35),
      population: randomize(MIN_POPULATION, MAX_POPULATION),
      taxes: BASE_TAX_RATE,
      affection: randomize(10, 25),
      affinity: {
        people: randomize(50, 75),
        nobles: randomize(15, 30),
      },
      loans: [
        {
          id: generate(),
          amount: 25000,
          rate: 0.05,
          // this should make the lender our new Free Merchants lender below
          // once it gets concatenated with the original LENDERS Array
          lender: LENDERS.length,
          origination: 0,
        }
      ],
      lenders: [
        {
          name: 'Free Merchants',
          maxLoans: 5,
          maxDebt: 250000,
          rate: 0.02,
        },
      ],
      bargaining: 0.20,
    },
  },
  {
    name: 'Jonathan Slow',
    defaults: {
      coin: randomize(0, 100),
      unrest: randomize(0, 10),
      population: randomize(MIN_POPULATION, MAX_POPULATION),
      taxes: BASE_TAX_RATE,
      affection: randomize(30, 45),
      affinity: {
        people: randomize(75, 95),
        nobles: randomize(20, 40),
      },
      loans: [
        {
          id: generate(),
          amount: 5000,
          rate: 0.025,
          // this should make the lender our new The North lender below
          // once it gets concatenated with the original LENDERS Array
          lender: LENDERS.length,
          origination: 0,
        }
      ],
      lenders: [
        {
          name: 'The North',
          maxLoans: 5,
          maxDebt: 100000,
          rate: 0.025,
        },
      ],
      bargaining: 0.325,
    },
  },
];
