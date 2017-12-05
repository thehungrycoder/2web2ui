import { createSelector } from 'reselect';
import _ from 'lodash';

const isVerified = (domain) => domain.status.ownership_verified && domain.status.compliance_status === 'valid';
const getDomains = (state) => state.sendingDomains.list;

const readyFor = ({ ownership_verified, cname_status, dkim_status, mx_status }) => ({
  sending: ownership_verified,
  bounce: mx_status === 'valid' || cname_status === 'valid',
  dkim: dkim_status === 'valid'
});

export const selectVerifiedDomains = createSelector(
  [getDomains],
  (domains) => _.filter(domains, (domain) => isVerified(domain))
);

export const selectReadyForBounce = createSelector(
  [getDomains],
  (domains) => _.filter(domains, (domain) => readyFor(domain.status).bounce)
);

