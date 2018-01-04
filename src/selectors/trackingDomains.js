import { createSelector } from 'reselect';

const getTrackingDomains = (state) => state.trackingDomains.list;

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
