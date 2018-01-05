import _ from 'lodash';

/**
 * Reshapes deliveries by attempt for the accepted pie chart
 * Places 2+ attempts under a "2 or More" group
 */
export function reshapeDeliveries(deliveries) {
  const firstAttempt = { name: '1st Attempt', count: 0 };
  const overTwo = { name: '2 or More Attempts', count: 0 };
  const secondToFifth = { name: '2 to 5 Attempts', count: 0 };
  const sixthToNinth = { name: '6 to 9 Attempts', count: 0 };
  const overTen = { name: '10 or More Attempts', count: 0 };

  _.each(deliveries, ({ attempt, count_delivered }) => {
    if (attempt === 1) {
      firstAttempt.count = count_delivered;
    } else {
      overTwo.count += count_delivered;
    }

    if (attempt >= 2 && attempt <= 5) {
      secondToFifth.count += count_delivered;
    }

    if (attempt >= 6 && attempt <= 9) {
      sixthToNinth.count += count_delivered;
    }

    if (attempt > 9) {
      overTen.count += count_delivered;
    }
  });

  return [ firstAttempt, { ...overTwo, children: [secondToFifth, sixthToNinth, overTen]} ];
}
