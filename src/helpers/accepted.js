import { getMetricsFromKeys } from 'src/helpers/metrics';

// These metrics are here because they are shared between action,
// reducer, and selector and they involve computation
export function getAcceptedMetrics () {
  return getMetricsFromKeys([
    'count_sent',
    'count_accepted',
    'avg_delivery_time_first',
    'avg_delivery_time_subsequent',
    'avg_msg_size'
  ]);
}

/**
 * Reshapes deliveries by attempt for the accepted pie chart
 * Places 2+ attempts under a "2 or More" group
 */
export function reshapeAttempts (deliveries) {
  const first = { name: '1st Attempt', count: 0 };
  const overTwo = { name: '2 or More Attempts', count: 0 };
  const twoToFour = { name: '2 to 4 Attempts', count: 0 };
  const fiveToSeven = { name: '5 to 7 Attempts', count: 0 };
  const eightToTen = { name: '8 to 10 Attempts', count: 0 };
  const overEleven = { name: '11 or More Attempts', count: 0 };

  deliveries.forEach(({ attempt, count_delivered }) => {
    if (attempt === 1) {
      first.count = count_delivered;
    } else {
      overTwo.count += count_delivered;
    }

    if (attempt >= 2 && attempt <= 4) {
      twoToFour.count += count_delivered;
    }

    if (attempt >= 5 && attempt <= 7) {
      fiveToSeven.count += count_delivered;
    }

    if (attempt >= 8 && attempt <= 10) {
      eightToTen.count += count_delivered;
    }

    if (attempt > 10) {
      overEleven.count += count_delivered;
    }
  });

  return [ first, { ...overTwo, children: [twoToFour, fiveToSeven, eightToTen, overEleven]} ];
}
