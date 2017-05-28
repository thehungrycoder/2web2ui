import moment from 'moment';

const apiFormat = 'YYYY-MM-DDTHH:MM';
const defaultParams = () => ({
  from: moment().subtract(1, 'days').format(apiFormat),
  metrics: 'count_targeted'
});

export function fetch (url, params = {}) {
  return {
    type: 'SPARKPOST_API_REQUEST',
    meta: {
      type: 'FETCH_METRICS',
      method: 'GET',
      url: `/metrics/${url}`,
      params: {
        ...defaultParams(),
        ...params
      }
    }
  };
}

export function fetchDeliverability (params = {}) {
  return fetch('deliverability', params);
}

export function getTimeSeries (params = {}) {
  return fetch('time-series', params);
}
