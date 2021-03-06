import { createSelector } from 'reselect';
import _ from 'lodash';

const getTrackingDomains = (state) => state.trackingDomains.list;
const selectSubaccountFromProps = (state, props) => _.get(props, 'domain.subaccount_id', null);

export const convertStatus = ({ verified, compliance_status }) => {
  if (compliance_status !== 'valid') {
    return compliance_status;
  }
  if (!verified) {
    return 'unverified';
  }
  return 'verified';
};

export const selectTrackingDomainsAreLoaded = createSelector(
  [getTrackingDomains],
  (trackingDomains) => !!trackingDomains
);

export const selectTrackingDomainsList = createSelector(
  [getTrackingDomains],
  (trackingDomains = []) => trackingDomains.map((item) => ({
    ...item,
    verified: item.status.verified,
    status: convertStatus(item.status)
  }))
);

export const selectUnverifiedTrackingDomains = createSelector(
  [selectTrackingDomainsList],
  (trackingDomains) => trackingDomains.filter((item) => !item.verified)
);

// currently used to just get domains owned by a subaccount/master account
export const selectVerifiedTrackingDomains = createSelector(
  [selectTrackingDomainsList, selectSubaccountFromProps],
  (trackingDomains, subaccount) => trackingDomains.filter((domain) => {
    if (!domain.verified) {
      return false;
    }

    return subaccount
      ? domain.subaccount_id === Number(subaccount)
      : !domain.subaccount_id;
  })
);

export const selectVerifiedTrackingDomainsOptions = createSelector(
  [selectVerifiedTrackingDomains],
  (trackingDomains) => trackingDomains.map((item) => ({ label: item.domain, value: item.domain }))
);

export const selectDefaultTrackingDomainOption = createSelector(
  [selectVerifiedTrackingDomains],
  (trackingDomains) => {
    const defaultDomain = _.find(trackingDomains, { default: true });
    const defaultOption = defaultDomain ? defaultDomain.domain : 'System Default';
    // setting to empty string resets the tracking domain
    return [{ label: `Always Use Default (Currently ${defaultOption})`, value: '' }];
  }
);

export const selectTrackingDomainsOptions = createSelector(
  [selectVerifiedTrackingDomainsOptions, selectDefaultTrackingDomainOption],
  (verified, defaultDomain) => defaultDomain.concat(verified)
);
