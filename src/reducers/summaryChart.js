import { getMetricsFromKeys, transformData } from 'src/helpers/metrics';
import config from 'src/config';

const initialState = {
  chartLoading: false,
  tableLoading: false,
  metrics: getMetricsFromKeys(config.summaryChart.defaultMetrics),
  precision: '',
  chartData: [],
  tableData: [],
  groupBy: 'aggregate'
};

export default (state = initialState, { type, payload, meta }) => {
  switch (type) {
    case 'FETCH_CHART_DATA_PENDING':
      return { ...state, chartLoading: true };

    case 'FETCH_CHART_DATA_SUCCESS':
    case 'FETCH_CHART_DATA_FAIL':
      return { ...state, chartLoading: false };

    case 'FETCH_TABLE_DATA_PENDING': {
      const { context: { groupBy }} = meta;
      return { ...state, tableLoading: true, tableData: [], groupBy };
    }

    case 'FETCH_TABLE_DATA_SUCCESS':
    case 'FETCH_TABLE_DATA_FAIL':
      return { ...state, tableLoading: false };

    case 'REFRESH_SUMMARY_CHART': {
      const { data, metrics, precision } = payload;
      return { ...state, chartData: transformData(data, metrics), metrics, precision };
    }

    case 'REFRESH_SUMMARY_TABLE': {
      const { data, metrics } = payload;
      return { ...state, tableData: transformData(data, metrics) };
    }

    default:
      return state;
  }
};
