import { isAws, isCustomBilling } from 'src/helpers/conditions/account';
import { formatCreateData, formatDataForCors } from 'src/helpers/billing';
import { fetch as fetchAccount } from './account';
import chainActions from 'src/actions/helpers/chainActions';
import { cors, createZuoraAccount, syncSubscription, updateSubscription, consumePromoCode } from './billing';

export default function billingCreate(values) {
  return (dispatch, getState) => {
    // AWS plans don't get created through Zuora, instead update existing
    // subscription to the selected plan
    if (isAws(getState())) {
      return dispatch(updateSubscription({ code: values.planpicker.code }));
    }

    const { corsData, billingData } = formatDataForCors(values);

    // action creator wrappers for chaining as callbacks
    const corsCreateBilling = ({ meta }) => cors({ meta, context: 'create-account', data: corsData });
    const fetchUsageAndBilling = ({ meta }) => fetchAccount({ include: 'usage,billing', meta });
    const constructZuoraAccount = ({ results: { signature, token, ...results }, meta }) => {
      const state = getState();
      const invoiceCollect = !isCustomBilling(state); // don't send initial invoice for custom plans
      const data = formatCreateData({ ...results, ...billingData, invoiceCollect });

      // add user's email when creating account
      data.billToContact.workEmail = state.currentUser.email;
      return createZuoraAccount({ data, token, signature, meta });
    };

    const actions = [corsCreateBilling, constructZuoraAccount, syncSubscription, fetchUsageAndBilling];
    if (values.promoCode) {
      const consumePromo = ({ meta }) => consumePromoCode({ meta, promoCode: values.promoCode, billingId: billingData.billingId });
      actions.push(consumePromo);
    }
    return dispatch(chainActions(...actions)());
  };
}
