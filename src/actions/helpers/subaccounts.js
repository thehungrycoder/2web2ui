import _ from 'lodash';
import { getSubaccountGrants } from 'src/selectors/api-keys';

export function formatSubaccount(values, getState) {
  const {
    name,
    createApiKey,
    ipPool
  } = values;

  const subaccount = { name };

  if (createApiKey) {
    const {
      keyName,
      grantsRadio,
      validIps
    } = values;

    subaccount.key_label = keyName;

    if (grantsRadio === 'all') {
      subaccount.key_grants = _.keys(getSubaccountGrants(getState()));
    } else {
      const { grants } = values;
      subaccount.key_grants = _.keys(_.pickBy(grants));
    }

    if (validIps) {
      subaccount.key_valid_ips = validIps.split(',').map(_.trim);
    }

  } else {
    subaccount.setup_api_key = false;
  }

  if (ipPool !== 'default') {
    subaccount.ip_pool = ipPool;
  }

  return subaccount;
}

