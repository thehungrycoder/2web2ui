import { getMetricsFromKeys, transformData } from 'helpers/metrics';

const initialState = {
  loading: false,
  metrics: getMetricsFromKeys(['count_targeted', 'spam_complaint_rate', 'count_accepted', 'count_bounce']),
  precision: '',
  data: []
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'FETCH_METRICS_PENDING':
      return { ...state, loading: true };

    case 'FETCH_METRICS_SUCCESS':
    case 'FETCH_METRICS_FAIL':
      return { ...state, loading: false };

    case 'REFRESH_SUMMARY_CHART': {
      const { data, metrics, precision } = payload;
      return { ...state, data: transformData(data, metrics), metrics, precision };
    }

    default:
      return state;
  }
};
