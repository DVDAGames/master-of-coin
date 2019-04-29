export default [
  {
    actionId: 'welcome',
    message: 'Congratulations on your new appointment as Master of Coin. The mysterious circumstances surrounding your predecessor\'s disappearance are most unfortunate, but the kingdom must continue to operate even as we mourn.',
    options: [
      {
        id: 'startGame',
        action: 'Accept appointment',
        value: 1,
      },
      {
        id: 'quitGame',
        action: 'Decline appointment',
        value: 0,
      },
    ],
    modifiers: {},
  },
  {
    actionId: 'firstRequest',
    kings: [
      {
        message: 'The King wants to raise the people\'s spirits with a celebratory tournament.',
        cost: 10000,
        daysPassed: 20,
        modifiers: {
          unrest: -10,
          affinity: {
            people: 25,
            nobles: 15,
          },
          affection: 10,
        },
      },
      {
        message: 'The Queen wants to destroy the religious order that\'s gaining popularity with the people.',
        cost: 20000,
        daysPassed: 30,
        modifiers: {
          unrest: 5,
          affinity: {
            people: -25,
            nobles: -10,
          },
          affection: 20,
        },
      },
      {
        message: 'The King wants to celebrate his birthday.',
        cost: 40000,
        daysPassed: 15,
        modifiers: {
          unrest: -5,
          affinity: {
            people: 5,
            nobles: 5,
          },
          affection: 5,
        },
      },
      {
        message: 'The Queen wants to institute a universal basic income system.',
        cost: 90000,
        daysPassed: 60,
        modifiers: {
          unrest: -20,
          affinity: {
            people: 45,
            nobles: 5,
          },
          affection: 25,
        },
      },
      {
        message: 'The King needs to raise an army to fight the zombies in the Far North.',
        cost: 75000,
        daysPassed: 90,
        modifiers: {
          unrest: 1,
          affinity: {
            people: 10,
            nobles: 5,
          },
          affection: 30,
        },
      },
      {
        message: 'The King wants to build the greatest navy the world has ever seen.',
        cost: 100000,
        daysPassed: 35,
        modifiers: {
          unrest: 7.5,
          affinity: {
            people: 5,
            nobles: 10,
          },
          affection: 20,
        },
      },
      {
        message: 'The King wants to send aid to the Black Watch.',
        cost: 45000,
        daysPassed: 10,
        modifiers: {
          unrest: 10,
          affinity: {
            people: 5,
            nobles: 5,
          },
          affection: 15,
        },
      },
    ],
  },
  {
    actionId: 'northernRebellion',
    message: 'The Northerners are attempting to rebel. The army needs war time funding.',
    cost: 25000,
    noBargain: true,
    daysPassed: 30,
    modifiers: {
      unrest: 10,
      affinity: {
        people: -5,
        nobles: -10,
      },
      affection: 2,
    },
  },
  {
    actionId: 'fireIslandRebellion',
    message: 'The Fire Islands are attempting to rebel. The army needs war time funding.',
    cost: 25000,
    noBargain: true,
    daysPassed: 30,
    modifiers: {
      unrest: 10,
      affinity: {
        people: -5,
        nobles: -10,
      },
      affection: 2,
    },
  },
  {
    actionId: 'wildPeopleAttack',
    message: 'The Wild People are invading from the North. The army needs war time funding.',
    cost: 25000,
    daysPassed: 30,
    modifiers: {
      unrest: 15,
      affinity: {
        people: -5,
        nobles: -10,
      },
      affection: 5,
    },
  },
  {
    actionId: 'easternTradeNegotionation',
    message: 'The Merchants Guild in the East wants to renegotiate their trade contract.',
    cost: 45000,
    daysPassed: 10,
    modifiers: {
      unrest: 0,
      affinity: {
        people: 0,
        nobles: 10,
      },
      affection: 0,
    },
  },
  {
    actionId: 'freeMerchantTradeNegotionation',
    message: 'The Free Merchants in the East are offering the kingdom a trade deal.',
    cost: 25000,
    daysPassed: 10,
    modifiers: {
      unrest: 0,
      affinity: {
        people: 5,
        nobles: 0,
      },
      affection: 0,
    },
  },
  {
    actionId: 'guardCoverUp',
    message: 'The city guard has been taking advantage of the people. We need to pay some citizens to make amends and others to keep quiet.',
    cost: 15000,
    daysPassed: 1,
    modifiers: {
      unrest: 25,
      affinity: {
        people: -10,
        nobles: -5,
      },
      affection: 0,
    },
  },
  {
    actionId: 'plague',
    message: 'A plague is sweeping the city. We need medical supplies and priests and to pay for disposal of the infected cadavers.',
    cost: 40000,
    daysPassed: 15,
    modifiers: {
      unrest: 20,
      affinity: {
        people: -5,
        nobles: 5,
      },
      affection: 0,
      population: -0.20,
    },
  },
  {
    actionId: 'famine',
    message: 'Crops aren\'t growing and the people can\'t eat. We need to purchase food and replenish our stores.',
    cost: 50000,
    daysPassed: 20,
    modifiers: {
      unrest: 25,
      affinity: {
        people: 10,
        nobles: -10,
      },
      affection: 10,
      population: -0.01,
    },
  },
  {
    actionId: 'blackWatch',
    message: 'The Black Watch has requested aid in protecting the Northern border wall.',
    cost: 10000,
    daysPassed: 1,
    modifiers: {
      unrest: 0,
      affinity: {
        people: 5,
        nobles: 5,
      },
      affection: 5,
      population: -0.0025,
    },
  },
  {
    actionId: 'royalWedding',
    message: 'There\'s to be a royal wedding! Surely this will be a splendid affair.',
    cost: 100000,
    daysPassed: 5,
    modifiers: {
      unrest: -10,
      affinity: {
        people: 10,
        nobles: 10,
      },
      affection: 10,
    },
    wedding: true,
  },
  {
    actionId: 'refugees',
    message: 'Refugees from the East have fled civil unrest and are seeking safety in the city.',
    cost: 25000,
    daysPassed: 10,
    modifiers: {
      unrest: 2.50,
      affinity: {
        people: -10,
        nobles: -20,
      },
      affection: 10,
    },
    population: 0.0275
  },
];
