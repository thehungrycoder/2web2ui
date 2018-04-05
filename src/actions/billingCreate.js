import { isAws } from 'src/helpers/conditions/account';
import { formatCreateData, formatDataForCors } from 'src/helpers/billing';
import { fetch as fetchAccount } from './account';
import chainActions from 'src/actions/helpers/chainActions';
import { cors, createZuoraAccount, syncSubscription, updateSubscription } from './billing';

export default function billingCreate(values) {
  return (dispatch, getState) => {
    // AWS plans don't get created through Zuora, instead update existing
    // subscription to the selected plan
    if (isAws(getState())) {
      return dispatch(updateSubscription({ code: values.planpicker.code, isAwsAccount: true }));
    }

    const { corsData, billingData } = formatDataForCors(values);

    // action creator wrappers for chaining as callbacks
    const corsCreateBilling = ({ meta }) => cors({ meta, context: 'create-account', data: corsData });
    const fetchUsageAndBilling = ({ meta: { onSuccess }}) => fetchAccount({ include: 'usage,billing' }, onSuccess);
    const constructZuoraAccount = ({ results, meta }) => {
      const { token, signature } = results;
      const { currentUser } = getState();
      const data = formatCreateData({ ...results, ...billingData });

      // add user's email when creating account
      data.billToContact.workEmail = currentUser.email;
      return createZuoraAccount({ data, token, signature, meta });
    };
    const actions = [corsCreateBilling, constructZuoraAccount, syncSubscription, fetchUsageAndBilling];

    return dispatch(chainActions(...actions)());
  };
}
