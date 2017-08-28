import { getMetricsFromKeys, transformData } from 'helpers/metrics';

const initialState = {
  metrics: getMetricsFromKeys(['count_targeted', 'spam_complaint_rate', 'count_accepted', 'count_bounce']),
  precision: '',
  data: []
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'REFRESH_SUMMARY_CHART': {
      const { data, metrics, precision } = payload;
      return { ...state, data: transformData(data, metrics), metrics, precision };
    }

    default:
      return state;
  }
};
