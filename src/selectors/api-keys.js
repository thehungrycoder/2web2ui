import _ from 'lodash';
import { createSelector } from 'reselect';
import { getSubaccountIdFromProps, selectSubaccountIdFromQuery } from './subaccounts';
/*
 * generic apiKeys selectors
 */
const getApiKeys = (state) => state.apiKeys.keys;
const getGrantsArray = (state) => state.apiKeys.grants;
const getSubaccountGrantsArray = (state) => state.apiKeys.subaccountGrants;
export const selectApiKeyId = (state, props) => props.match.params.id;
const getGrantsLoading = (state) => state.apiKeys.grantsLoading;
const getSubaccountGrantsLoading = (state) => state.apiKeys.subaccountGrantsLoading;
const getCurrentUsername = (state) => state.currentUser.username;

// Convert grants array to an object keyed by `grant.key`
export const getGrants = createSelector(getGrantsArray, (grants) =>
  _.keyBy(grants, 'key')
);

export const getSubaccountGrants = createSelector(getSubaccountGrantsArray, (grants) =>
  _.keyBy(grants, 'key')
);

export const getFormLoading = createSelector(
  [getGrantsLoading, getSubaccountGrantsLoading],
  (grantsLoading, subaccountGrantsLoading) =>
    grantsLoading || subaccountGrantsLoading
);

export const getCurrentApiKey = createSelector(
  [getApiKeys, selectApiKeyId, selectSubaccountIdFromQuery],
  (keys, id, subaccountId) => _.find(keys, (key) =>
    key.id === id && (!key.subaccount_id || key.subaccount_id === subaccountId)
  ) || {});


export const getIsNew = createSelector(getCurrentApiKey, (apiKey) =>
  _.isEmpty(apiKey)
);

export const getInitialGrantsRadio = createSelector(
  [getGrants, getCurrentApiKey, getIsNew],
  (grants, apiKey, isNew) => isNew || _.size(grants) <= _.size(apiKey.grants) ? 'all' : 'select'
);

export const getInitialValues = createSelector(
  [getGrants, getCurrentApiKey],
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

export const canCurrentUserEditKey = (key, currentUsername) => Boolean((key.username === currentUsername) || (!key.username && key.subaccount_id));

export const selectKeysForAccount = createSelector(
  [getApiKeys, getCurrentUsername],
  (keys, currentUsername) => keys.map((key) => ({ ...key, canCurrentUserEdit: canCurrentUserEditKey(key, currentUsername) }))
);
