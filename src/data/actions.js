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
        action: 'Resign',
        value: 0,
      },
    ],
  },
  {
    actionId: 'firstDay',
    kings: [
      {
        message: 'The King wants to raise the people\'s spirits with a celebratory tournament. You need 5000 crowns to make it happen.',
        options: [
          {
            id: 'loan',
            message: 'Get a loan for 5000 from the Bank of Lead at 5% interest.',
            action: 'Get a Loan',
            value: {
              loans: {
                amount: 5000,
                rate: 0.05,
                lender: 0,
              }
            }
          },
          {
            id: 'loanTax',
            message: 'Get a loan for 5000 from the Bank of Lead at 5% interest and increases taxes to repay the debt.',
            action: 'Get a Loan and Increase Taxes',
            value: 2,
          },
          {
            id: 'bargainLoan',
            message: 'Talk the King down to a celebration that costs 2500 and get a loan for 2500 from the Bank of Lead at 5% interest.',
            action: 'Bargain with the King and Get a Loan',
            value: 3,
          },
          {
            id: 'bargainLoanTax',
            message: 'Talk the King down to a celebration that costs 2500, get a loan for 2500 from the Bank of Lead at 5% interest, and increase taxes to repay the debt.',
            action: 'Bargain with the King, Get a Loan, and Increase Taxes',
            value: 4,
          },
          {
            id: 'borrow',
            message: 'Borrow 5000 from the court\'s nobles.',
            action: 'Borrow from the Nobles',
            value: 5,
          },
          {
            id: 'borrowTax',
            message: 'Borrow 5000 from the court\'s nobles and increase taxes to repay the debt.',
            action: 'Borrow from the Nobles and Increase Taxes',
            value: 6,
          },
          {
            id: 'resign',
            message: 'Convince the King not to throw the tournament.',
            action: 'Try to Stop the Tournament',
            value: 0,
          },
        ],
      },
    ],
  },
];
