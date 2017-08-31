import { fetch as fetchMetrics } from './metrics';

const actionType = 'REFRESH_AUTOCOMPLETE';

function getACDomains(params) {
  const path = '/domains';
  const meta = { cacheKey: 'domains' };
  return fetchMetrics({ path, params, meta, actionType });
}

function getACCampaigns(params) {
  const path = '/campaigns';
  const meta = { cacheKey: 'campaigns' };
  return fetchMetrics({ path, params, meta, actionType });
}

export function refreshAutocomplete(params) {
  return (dispatch) => {
    dispatch(getACDomains(params));
    dispatch(getACCampaigns(params));
  };
}

export function addFilter(payload) {
  return {
    type: 'ADD_FILTER',
    payload
  };
}

export function removeFilter(payload) {
  return {
    type: 'REMOVE_FILTER',
    payload
  };
}

export function searchFilter(payload) {
  return {
    type: 'SEARCH_FILTER',
    payload: [
      { value: 'domain.com', type: 'domain' },
      { value: '123', type: 'subaccount' },
      { value: 'domain.net', type: 'domain' }
    ]
  };
}
