import { getMetricsFromList, transformData } from 'helpers/metrics';

const initialState = {
  metrics: getMetricsFromList(['count_targeted', 'spam_complaint_rate', 'count_accepted', 'count_bounce']),
  precision: '',
  data: []
};

export default (state = initialState, { type, payload, meta }) => {
  switch (type) {
    case 'FETCH_METRICS_SUCCESS': {
      const { metrics, precision } = meta;
      return { ...state, data: transformData(payload, metrics), metrics, precision };
    }

    default:
      return state;
  }
};
