import _ from 'lodash';

const translateSubaccount = (id) => {
  // Note: Subaccount -1 (aggregate of all subaccounts) does not have a details Page

  if (String(id) === '0') {
    return 'Master Account';
  }

  return `Subaccount ${id}`;
};

export const getFriendlyTitle = ({ prefix, facet, facetId, subaccountId }) => {
  if (!prefix) {
    return null;
  }

  let subtitle = `${prefix} ${facetId}`;
  let suffix = '';

  if (facet === 'sid') {
    subtitle = `${prefix} ${translateSubaccount(facetId)}`;
  }

  if (!_.isNil(subaccountId)) {
    suffix = ` (${translateSubaccount(subaccountId)})`;
  }

  return `${subtitle}${suffix}`;
};
