import { createSelector } from 'reselect';
import { resolveReadyFor } from 'src/helpers/domains';
import _ from 'lodash';

const isVerified = (domain) => domain.status.ownership_verified && domain.status.compliance_status === 'valid';
const getDomains = (state) => state.sendingDomains.list;

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

const getSubaccountId = (state, props) => props.subaccountId;

export const selectVerifiedDomainsBySubaccount = createSelector(
  [getDomains, getSubaccountId],
  (domains, subaccountId) => _.filter(domains, (domain) => {

    if (!isVerified(domain)) {
      return false;
    }

    return subaccountId ? domain.shared_with_subaccounts || domain.subaccount_id === Number(subaccountId) : !domain.subaccount_id;
  })
);
