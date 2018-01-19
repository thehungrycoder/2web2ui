import engagementReportReducer from '../engagementReport';
import cases from 'jest-in-case';

cases('get engagement chart data', (action) => {
  expect(engagementReportReducer(undefined, action)).toMatchSnapshot();
}, {
  'when failed': {
    type: 'GET_ENGAGEMENT_CHART_DATA_FAIL',
    payload: {
      message: 'Oh no!'
    }
  },
  'when pending': {
    type: 'GET_ENGAGEMENT_CHART_DATA_PENDING'
  },
  'when succeeds': {
    type: 'GET_ENGAGEMENT_CHART_DATA_SUCCESS',
    payload: [{ count_accepted: 237433, count_targeted: 272234 }]
  }
});
