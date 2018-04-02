import { fetch as fetchAccount } from './account';
import { formatUpdateData } from 'src/helpers/billing';
import chainActions from 'src/actions/helpers/chainActions';
import { collectPayments, cors, syncSubscription, updateSubscription } from './billing';
import zuoraRequest from './helpers/zuoraRequest';

// note: this action creator should detect
// 1. if payment info is present, contact zuora first
// 2. otherwise it's just a call to our API + sync + refetch
//
// call this action creator from the "free -> paid" form if account.billing is present
export default function billingUpdate(values) {
  return (dispatch) => {
    const actions = [
      { action: cors, args: { context: 'update-billing' }},
      { action: updateZuoraCC },
      { action: syncSubscription },
      { action: collectPayments },
      { action: fetchAccount }
    ];

    if (values.planpicker) {
      actions.splice(2, 0, { action: updateSubscription, args: { code: values.planpicker.code }});
    }

    return dispatch(chainActions(actions));

    function updateZuoraCC({ meta, getState, results: { accountKey, token, signature }}) {
      const data = formatUpdateData({ ...values, accountKey });
      return zuoraRequest({
        type: 'ZUORA_UPDATE_CC',
        meta: {
          method: 'POST',
          url: '/payment-methods/credit-cards',
          data,
          headers: { token, signature },
          ...meta
        }
      });
    }
  };
}
