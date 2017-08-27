import { getMetricsFromList } from 'helpers/metrics';

const initialState = {
  metrics: getMetricsFromList(['count_targeted', 'count_rendered', 'count_accepted', 'count_bounce']),
  precision: ''
};

export default (state = initialState, { type, payload, meta }) => {
  switch (type) {
    case 'FETCH_METRICS_SUCCESS': {
      const { metrics, precision } = meta;
      return { metrics, precision };
    }

    default:
      return state;
  }
};
