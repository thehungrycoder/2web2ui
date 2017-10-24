import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import { formatSubaccount } from './helpers/subaccounts';

export function list() {
  return (dispatch) => dispatch(
    sparkpostApiRequest({
      type: 'LIST_SUBACCOUNTS',
      meta: {
        method: 'GET',
        url: '/subaccounts'
      }
    })
  );
}

export function create(values) {
  return (dispatch, getState) => dispatch(
    sparkpostApiRequest({
      type: 'CREATE_SUBACCOUNT',
      meta: {
        method: 'POST',
        url: '/subaccounts',
        data: { ...formatSubaccount(values, getState) }
      }
    })
  );
}
