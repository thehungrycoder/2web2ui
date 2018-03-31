// note: this action creator should detect
// 1. if payment info is present, contact zuora first
// 2. otherwise it's just a call to our API + sync + refetch
//
// call this action creator from the "free -> paid" form if account.billing is present
import { fetch as fetchAccount } from './account';
import { formatUpdateData } from '../helpers/billing';
import { collectPayments, cors, syncSubscription, updateCreditCard, updateSubscription } from './billing';
import zuoraRequest from './helpers/zuoraRequest';

export default function billingUpdate(values) {
  // if (values.planpicker) {
  //   dispatch(updateSubscription({ code: values.planpicker.code }));
  // }

  return (dispatch) => {
    const actions = [
      { action: cors, args: { context: 'update-billing' }},
      { action: updateZuoraCC },
      // { action: updateSubscription, args: { code: values.planpicker.code }},
      { action: syncSubscription },
      { action: collectPayments },
      { action: fetchAccount }
    ];

    return dispatch(chainActions(actions));

    // return dispatch(cors({ context: 'update-billing', meta: { onSuccess: (results) =>
    //   updateZuoraCC({ results, meta: { onSuccess: () =>
    //     syncSubscription({ meta: { onSuccess: () =>
    //       collectPayments({ meta: { onSuccess: () =>
    //         fetchAccount()
    //       }})
    //     }})
    //   }})
    // }}));

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

/**
 return actions[0].action({ ...actions[0].args, meta: { onSuccess: (results) =>
    actions[1].action({ ...actions[1].args, results, meta: { onSuccess: () =>
      actions[2].action({ ...actions[2].args, meta: { onSuccess: () =>
        actions[3].action({ ...actions[3].args, meta: { onSuccess: () =>
          actions[4].action({ ...actions[4].args })
        }})
      }})
    }})
  }});
**/

function chainActions(actions) {
  return actions.reduceRight((last, current, index) => {
    const meta = last ? { onSuccess: last } : null;
    if (index === 0) { // the first action gets called directly, without results from anything
      return current.action({ ...current.args, meta });
    }
    return (results) => current.action({ ...current.args, ...results, meta });
  }, undefined);
}
