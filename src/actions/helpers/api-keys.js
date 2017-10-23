import _ from 'lodash';
import { getGrants, getSubaccountGrants } from 'src/selectors/api-keys';

export function formatKeyForRequest(key, getState) {
  const request = { data: {}};

  if (key.subaccount) {
    request.headers = { 'X-MSYS-SUBACCOUNT': key.subaccount.id };
  }

  request.data.label = key.label;

  if (key.grantsRadio === 'all') {
    const grants = key.subaccount ? getSubaccountGrants : getGrants;
    request.data.grants = _.keys(grants(getState()));
  } else {
    request.data.grants = _.keys(_.pickBy(key.grants));
  }

  if (key.validIps) {
    request.data.valid_ips = key.validIps.split(',').map(_.trim);
  }

  return request;
}
