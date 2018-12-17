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
    date: moment().subtract(count - n, 'day').format('YYYY-MM-DD')
  };
});

export function getSpamTrapDetails() {
  return (dispatch, getState) => {
    const { relativeRange } = getState().signalOptions;
    const count = Number(relativeRange.replace('days', ''));
    const data = spamTrapDetails(count);

    dispatch({
      type: 'GET_SIGNALS_SPAM_TRAPS_DETAILS_PENDING'
    });

    setTimeout(() => dispatch({
      type: 'GET_SIGNALS_SPAM_TRAPS_DETAILS_SUCCESS',
      payload: {
        data: data,
        total_count: data.length
      }
    }), 500);
  };
}
