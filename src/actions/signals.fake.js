/* eslint-disable max-lines */
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

const engagementDetails = (count) => _.range(count).map((n) => {
  const c_new = randInt(50000, 10000);
  const c_14d = randInt(50000, 25000);
  const c_90d = randInt(50000, 25000);
  const c_365d = randInt(50000, 15000);
  const c_uneng = randInt(50000, 25000);
  const c_total = [c_new, c_14d, c_90d, c_365d, c_uneng].reduce((a, b) => a + b, 0);

  return {
    c_new, c_14d, c_90d, c_365d, c_uneng, c_total,
    dt: moment().subtract(count - n, 'day').format('YYYY-MM-DD')
  };
});

export function getEngagementRecency({ facet, filter }) {
  return (dispatch, getState) => {
    const { relativeRange } = getState().signalOptions;
    const count = Number(relativeRange.replace('days', ''));
    const data = engagementDetails(count);

    dispatch({
      type: 'GET_ENGAGEMENT_RECENCY_PENDING'
    });

    setTimeout(() => dispatch({
      type: 'GET_ENGAGEMENT_RECENCY_SUCCESS',
      payload: {
        data: [
          {
            [facet]: filter,
            history: data
          },
          {
            // simulating multiple results to for facetid matching
            [facet]: 'notthisone',
            history: data
          }
        ],
        total_count: 2
      }
    }), 500);
  };
}

const healthScoreDetails = (count) => _.range(count).map((n) => {
  const health_score = randInt(100) / 100;
  const weights = [
    {
      weight_type: 'List Quality',
      weight: -randInt(100) / 100,
      weight_value: randInt(100) / 100
    },
    {
      weight_type: 'Hard Bounces',
      weight: -randInt(100) / 100,
      weight_value: randInt(100) / 100
    },
    {
      weight_type: 'Block Bounces',
      weight: -randInt(100) / 100,
      weight_value: randInt(100) / 100
    },
    {
      weight_type: 'Complaints',
      weight: randInt(100) / 100,
      weight_value: randInt(100) / 100
    },
    {
      weight_type: 'Transient Failures',
      weight: randInt(100) / 100,
      weight_value: randInt(100) / 100
    },
    {
      weight_type: 'Other bounces',
      weight: randInt(100) / 100,
      weight_value: randInt(100) / 100
    },
    {
      weight_type: 'eng cohorts: new, 14-day',
      weight: randInt(100) / 100,
      weight_value: randInt(100) / 100
    },
    {
      weight_type: 'eng cohorts: unengaged',
      weight: randInt(100) / 100,
      weight_value: randInt(100) / 100
    }
  ];


  return {
    health_score, weights,
    dt: moment().subtract(count - n, 'day').format('YYYY-MM-DD')
  };
});

export function getHealthScore({ facet, filter }) {
  return (dispatch, getState) => {
    const { relativeRange } = getState().signalOptions;
    const count = Number(relativeRange.replace('days', ''));
    const data = healthScoreDetails(count + 1);

    dispatch({
      type: 'GET_HEALTH_SCORE_PENDING'
    });

    setTimeout(() => dispatch({
      type: 'GET_HEALTH_SCORE_SUCCESS',
      payload: {
        data: [
          {
            [facet]: filter,
            history: data,
            current_weights: data[0].weights,
            current_health_score: data[0].health_score
          },
          {
            // simulating multiple results to for facetid matching
            [facet]: 'notthisone',
            history: data,
            current_weights: data[0].weights,
            current_health_score: data[0].health_score
          }
        ],
        total_count: 2
      }
    }), 500);
  };
}
