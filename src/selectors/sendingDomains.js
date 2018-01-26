import { createSelector } from 'reselect';
import { resolveReadyFor } from 'src/helpers/domains';
import _ from 'lodash';

export const isVerified = (domain) => domain.status.ownership_verified && domain.status.compliance_status === 'valid';
export const getDomains = (state) => state.sendingDomains.list;

export const selectVerifiedDomains = createSelector(
  [getDomains],
  (domains) => _.filter(domains, (domain) => isVerified(domain))
);

export const selectReadyForBounce = createSelector(
  [getDomains],
  (domains) => _.filter(domains, (domain) => resolveReadyFor(domain.status).bounce)
);

export const hasUnverifiedDomains = createSelector(
  [getDomains],
  (domains) => _.reduce(domains, (acc, domain) => acc || !isVerified(domain), false)
);
