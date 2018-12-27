import { fetch as fetchAccount } from './account';
import { formatUpdateData } from 'src/helpers/billing';
import chainActions from 'src/actions/helpers/chainActions';
import { collectPayments, cors, syncSubscription, updateCreditCard, updateSubscription } from './billing';

// note: this action creator should detect
// 1. if payment info is present, contact zuora first
// 2. otherwise it's just a call to our API + sync + refetch
//
// call this action creator from the "free -> paid" form if account.billing is present
export default function billingUpdate(values) {

  return (dispatch) => {
    // action creator wrappers for chaining as callbacks
    const corsUpdateBilling = ({ meta }) => (
      cors({ context: 'update-billing', meta })
    );
    const maybeUpdateSubscription = ({ meta }) => values.planpicker
      ? updateSubscription({ code: values.planpicker.code, promoCode: values.promoCode, meta })
      : meta.onSuccess({ meta }); // bypass
    const updateZuoraCC = ({ meta, results: { accountKey, token, signature }}) => (
      updateCreditCard({ data: formatUpdateData({ ...values, accountKey }), signature, token, meta })
    );
    const fetchAccountDetails = () => fetchAccount({ include: 'usage,billing' });
    const actions = [corsUpdateBilling, updateZuoraCC, maybeUpdateSubscription, syncSubscription, collectPayments, fetchAccountDetails];

    return dispatch(chainActions(...actions)());
  };
}
