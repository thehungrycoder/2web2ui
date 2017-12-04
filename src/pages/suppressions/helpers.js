import _ from 'lodash';

export function formatSubaccountDisplay(subaccountId, allSubAccounts) {
  if (!subaccountId) {
    return 'Master Account (0)';
  }

  const subaccount = _.find(allSubAccounts, {
    id: subaccountId
  });

  if (subaccount) {
    return `${subaccount.name} (${subaccount.id})`;
  } else {
    return subaccountId.toString();
  }
}
