import moment from 'moment';

const apiFormat = 'YYYY-MM-DDTHH:MM';
const defaultParams = () => ({
  from: moment().subtract(30, 'days').format(apiFormat),
  metrics: 'count_targeted'
});

export function fetch({ path, params = {}, meta = {}}) {
  return {
    type: 'SPARKPOST_API_REQUEST',
    meta: {
      ...meta,
      type: 'FETCH_METRICS',
      method: 'GET',
      url: `/metrics/${path}`,
      params: {
        ...defaultParams(),
        ...params
      }
    }
  };
}

export function fetchDeliverability(params = {}, meta = {}) {
  const path = 'deliverability';
  return fetch({ path, params, meta });
}

export function getTimeSeries(params = {}, meta = {}) {
  const path = 'deliverability/time-series';
  return fetch({ path , params, meta });
}
