import _ from 'lodash';
import { createSelector } from 'reselect';
import sortMatch from 'src/helpers/sortMatch';

/*
 * generic apiKeys selectors
 */
const getApiKeys = (state) => state.apiKeys.keys;
const getGrantsArray = (state) => state.apiKeys.grants;
const getSubaccounts = (state) => state.subaccounts.list;
const getApiKeyId = (state, props) => props.match.params.id;

const getKeysLoading = (state) => state.apiKeys.keysLoading;
const getGrantsLoading = (state) => state.apiKeys.grantsLoading;
const getSubaccountsLoading = (state) => state.subaccounts.listLoading;

const getFilters = (state) => state.form.apiKeysFilters && state.form.apiKeysFilters.values;

export const getApiKey = createSelector(
  [getApiKeys, getApiKeyId],
  (apiKeys, id) => _.find(apiKeys, { id })
);

// Convert grants array to an object keyed by `grant.key`
export const getGrants = createSelector(getGrantsArray, (grants) =>
  _.keyBy(grants, 'key')
);

export const getLoading = createSelector(
  [getKeysLoading, getGrantsLoading, getSubaccountsLoading],
  (keysLoading, grantsLoading, subaccountsLoading) =>
    keysLoading || grantsLoading || subaccountsLoading
);

// Filtered Keys
export const getFilteredKeys = createSelector(
  getApiKeys, getFilters,
  (list, filters = {}) => {
    let matches = list;
    const { search = false, subaccount = {}} = filters;

    if (search) {
      matches = sortMatch(
        matches, search,
        (item) => `${item.label} User: ${item.username} Shortkey: ${item.short_key} Subaccount: ${item.subaccount_id}`
      );
    }

    return matches.filter((item) => filterSubaccount(item, subaccount));
  }
);

const filterSubaccount = (item, filter) => {
  if (!filter.master && !filter.subaccount) {
    return true;
  }

  if (filter.subaccount && item.subaccount_id) {
    return true;
  }

  if (filter.master && !item.subaccount_id) {
    return true;
  }

  return false;
};

/*
 * ApiKeyForm selectors
 */
const getFormApiKey = (state, props) => props.apiKey || {};

export const getIsNew = createSelector(getFormApiKey, (apiKey) =>
  _.isEmpty(apiKey)
);

export const getInitialGrantsRadio = createSelector(
  [getGrants, getFormApiKey, getIsNew],
  (grants, apiKey, isNew) =>
    isNew || _.size(grants) <= _.size(apiKey.grants) ? 'all' : 'select'
);

export const getInitialSubaccount = createSelector(
  [getSubaccounts, getFormApiKey],
  (subaccounts, apiKey) => _.find(subaccounts, { id: apiKey.subaccount_id })
);

export const getInitialValues = createSelector(getFormApiKey, (apiKey) => {
  // using lodash methods here allow us to handle undefined values nicely.
  const grantsPairs = _.map(apiKey.grants, (grant) => [grant, 'true']);
  const grants = _.fromPairs(grantsPairs);
  const validIps = _.join(apiKey.valid_ips, ', ');

  return {
    ...apiKey,
    grants,
    validIps
  };
});
