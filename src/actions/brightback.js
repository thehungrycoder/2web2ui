import brightbackRequest from 'src/actions/helpers/brightbackRequest';
import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import { getRelativeDates } from 'src/helpers/date';
import { safeRate } from 'src/helpers/math';
import { getMetricsFromKeys, getQueryFromOptions } from 'src/helpers/metrics';

const METRICS = getMetricsFromKeys(['count_sent', 'count_unique_confirmed_opened_approx', 'count_accepted']);

export function prepBrightback(accountDetails) {
  return (dispatch) => dispatch(loadPrerequisiteMetrics())
    .then(([{
      count_sent = 0,
      count_unique_confirmed_opened_approx = 0,
      count_accepted = 1
    }]) => dispatch(precancel({
      custom: {
        activity: {
          emails: count_sent,
          open_rate: Math.round(safeRate(count_unique_confirmed_opened_approx, count_accepted))
        }
      },
      ...accountDetails
    })));
}

export function loadPrerequisiteMetrics() {
  const { from, to } = getRelativeDates('7days', false);
  const metricsRequest = getQueryFromOptions({ from, to, metrics: METRICS });
  return sparkpostApiRequest({
    type: 'BRIGHTBACK_METRICS',
    meta: {
      method: 'GET',
      url: '/metrics/deliverability',
      params: metricsRequest,
      showErrorAlert: false
    }
  });
}

export function precancel(data) {
  return brightbackRequest({
    type: 'BRIGHTBACK_PRECANCEL',
    meta: {
      method: 'POST',
      url: '/precancel',
      data,
      showErrorAlert: false
    }
  });
}
