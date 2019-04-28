export default [
  {
    actionId: 'welcome',
    message: 'Congratulations on your new appointment as Master of Coin. The mysterious circumstances surrounding your predecessor\'s death are most unfortunate, but the kingdom must continue to operate even as we mourn our loss.',
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
          affinity: {
            people: 25,
            nobles: 15,
          },
          affection: 10,
        }
      }
    ],
  },
  {
    actionId: 'northernRebellion',
    kings: [
      {
        message: 'The Northerners are attempting to rebel. The army needs war time funding.',
        cost: 25000,
        daysPassed: 30,
        modifiers: {
          unrest: 10,
          affinity: {
            people: -5,
            nobles: -10,
          },
          affection: 2,
        }
      }
    ]
  }
];
