import { dedupeFilters } from 'src/helpers/reports';
import { getMetricsFromKeys } from 'src/helpers/metrics';
import config from 'src/config';

const initialState = {
  relativeRange: 'day',
  activeList: [],
  metrics: getMetricsFromKeys(config.summaryChart.defaultMetrics)
};

export default (state = initialState, action) => {
  switch (action.type) {

    case 'REFRESH_REPORT_OPTIONS': {
      const { to = state.to, from = state.from, relativeRange = state.relativeRange, metrics = state.metrics } = action.payload;
      return { ...state, to, from, relativeRange, metrics };
    }

    case 'ADD_FILTERS':
      return { ...state, activeList: dedupeFilters([ ...state.activeList, ...action.payload ]) };

    case 'REMOVE_FILTER':
      return {
        ...state,
        activeList: [
          ...state.activeList.slice(0, action.payload),
          ...state.activeList.slice(action.payload + 1)
        ]
      };

    default:
      return state;
  }
};
