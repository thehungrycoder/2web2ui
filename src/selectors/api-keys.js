import _ from 'lodash';
import { createSelector } from 'reselect';
import { getSubaccountIdFromProps } from './subaccounts';
/*
 * generic apiKeys selectors
 */
const getApiKeys = (state) => state.apiKeys.keys;
const getGrantsArray = (state) => state.apiKeys.grants;
const getSubaccountGrantsArray = (state) => state.apiKeys.subaccountGrants;
export const selectApiKeyId = (props) => props.match.params.id;

const getGrantsLoading = (state) => state.apiKeys.grantsLoading;
const getSubaccountGrantsLoading = (state) => state.apiKeys.subaccountGrantsLoading;
const getSubaccountsLoading = (state) => state.subaccounts.listLoading;

// Convert grants array to an object keyed by `grant.key`
export const getGrants = createSelector(getGrantsArray, (grants) =>
  _.keyBy(grants, 'key')
);

export const getSubaccountGrants = createSelector(getSubaccountGrantsArray, (grants) =>
  _.keyBy(grants, 'key')
);

export const getFormLoading = createSelector(
  [getGrantsLoading, getSubaccountGrantsLoading, getSubaccountsLoading],
  (grantsLoading, subaccountGrantsLoading, subaccountsLoading) =>
    grantsLoading || subaccountGrantsLoading || subaccountsLoading
);

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

export const getInitialValues = createSelector(
  [getGrants, getFormApiKey],
  (grantsList, apiKey) => {
    const allGrants = _.keys(grantsList);
    /**
     * provides list of checked/unchecked values as
     * [['metrics/view', false], ['webhooks/view', true]]
     */
    const grantsPairs = _.map(allGrants, (grant) => ([grant, _.includes(apiKey.grants, grant)]));
    const grants = _.fromPairs(grantsPairs);
    const validIps = _.join(apiKey.valid_ips, ', ');

    return {
      ...apiKey,
      grants,
      validIps
    };
  }
);

export const getInitialSubaccountGrants = createSelector(
  [getSubaccountGrants],
  (subaccountGrants) => {
    // always setting the pairs to false because this is only on create
    // subaccounts can't edit api key grants
    const grantPairs = _.map(_.keys(subaccountGrants), (grant) => [grant, false]);
    return _.fromPairs(grantPairs);
  }
);

export const getSubaccountApiKeys = createSelector(
  [getApiKeys, getSubaccountIdFromProps],
  (apiKeys, id) => _.filter(apiKeys, ['subaccount_id', Number(id)])
);

export const selectApiKeysForSending = createSelector(
  [getApiKeys],
  (apiKeys) => apiKeys.filter((key) => key.grants.includes('smtp/inject') || key.grants.includes('transmissions/modify'))
);

export const selectApiKeysForSmtp = createSelector(
  [getApiKeys],
  (apiKeys) => apiKeys.filter((key) => key.grants.includes('smtp/inject'))
);
