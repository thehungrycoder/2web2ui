import _ from 'lodash';
import moment from 'moment';

const randInt = (max, min = 0) => Math.floor(Math.random() * (max - min + 1) + min);

const spamTrapDetails = (count) => _.range(count).map((n) => {
  const injections = randInt(50000, 25000);
  const trapHits = randInt(50, 15);
  const rate = trapHits / injections;
  return {
    injections,
    trap_hits: trapHits,
    relative_trap_hits: rate,
    dt: moment().subtract(count - n, 'day').format('YYYY-MM-DD')
  };
});

export function getSpamHits({ facet, filter }) {
  return (dispatch, getState) => {
    const { relativeRange } = getState().signalOptions;
    const count = Number(relativeRange.replace('days', ''));
    const data = spamTrapDetails(count);

    dispatch({
      type: 'GET_SPAM_HITS_PENDING'
    });

    setTimeout(() => dispatch({
      type: 'GET_SPAM_HITS_SUCCESS',
      payload: {
        data: [
          {
            [facet]: filter,
            current_trap_hits: 0,
            current_relative_trap_hits: 0,
            history: data
          },
          {
            // simulating multiple results to for facetid matching
            [facet]: 'notthisone',
            current_trap_hits: 0,
            current_relative_trap_hits: 0,
            history: data
          }
        ],
        total_count: 2
      }
    }), 500);
  };
}