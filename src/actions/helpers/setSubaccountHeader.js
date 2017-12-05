import _ from 'lodash';

export default function setSubaccountHeader(subaccount = null) {
  const headers = {};

  if (subaccount !== null) {
    headers['x-msys-subaccount'] = _.get(subaccount, 'id', subaccount);
  }

  return headers;
}
