import { isAws } from 'src/helpers/conditions/account';
import { formatCreateData, formatDataForCors } from 'src/helpers/billing';
import { fetch as fetchAccount } from './account';
import chainActions from 'src/actions/helpers/chainActions';
import { cors, createZuoraAccount, syncSubscription, updateSubscription } from './billing';

export function billingCreate(values) {
  return (dispatch, getState) => {
    // AWS plans don't get created through Zuora, instead update existing
    // subscription to the selected plan
    if (isAws(getState())) {
      return dispatch(updateSubscription({ code: values.planpicker.code }));
    }

    const { corsData, billingData } = formatDataForCors(values);

    const actions = [
      { action: cors, args: { context: 'create-account', data: corsData }},
      { action: constructZuoraAccount },
      { action: syncSubscription },
      { action: fetchAccount, args: { include: 'usage,billing' }}
    ];

    return dispatch(chainActions(actions));


    function constructZuoraAccount({ results }) {
      const { token, signature } = results;
      const { currentUser } = getState();
      const data = formatCreateData({ ...results, ...billingData });

      // add user's email when creating account
      data.billToContact.workEmail = currentUser.email;
      return createZuoraAccount({ data, token, signature });
    }
  };
}
