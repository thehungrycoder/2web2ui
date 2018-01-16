import _ from 'lodash';

export function formatSubaccountDisplay(subaccountId, allSubAccounts) {
  if (!subaccountId) {
    return 'Master Account (0)';
  }

  subaccountId = parseInt(subaccountId, 10);

  const subaccount = _.find(allSubAccounts, {
    id: subaccountId
  });

  if (subaccount) {
    return `${subaccount.name} (${subaccount.id.toString()})`;
  } else {
    return subaccountId.toString();
  }
}
