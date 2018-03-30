// note: this action creator should detect
// 1. if payment info is present, contact zuora first
// 2. otherwise it's just a call to our API + sync + refetch
//
// call this action creator from the "free -> paid" form if account.billing is present
import { fetch as fetchAccount } from './account';
import { formatUpdateData } from '../helpers/billing';
import { collectPayments, cors, syncSubscription, updateCreditCard, updateSubscription } from './billing';
import zuoraRequest from './helpers/zuoraRequest';

// export default function billingUpdate(values) {
//
//   return (dispatch) => {
//     // Update Zuora with new CC
//     function updateZuoraCC({ dispatch, getState, results: { accountKey, token, signature }}) {
//       const data = formatUpdateData({ ...values, accountKey });
//       return dispatch(updateCreditCard({ data, token, signature, onSuccess: maybeChangePlan }));
//     }
//
//     // change plan via our API if plan is included
//     function maybeChangePlan({ dispatch }) {
//       if (values.planpicker) {
//         dispatch(updateSubscription({ code: values.planpicker.code, onSuccess: snycThenCollect }));
//       } else {
//         syncSubscription(getPayments);
//       }
//     }
//
//     // sync our db with new Zuora state
//     // function doSync({ dispatch }) {
//     //   dispatch(syncSubscription(getPayments));
//     // }
//
//     function getPayments({ dispatch }) {
//       dispatch(collectPayments(refreshAccount));
//     }
//
//     // refetch the account
//     function refreshAccount({ dispatch }) {
//       dispatch(fetchAccount({ include: 'usage,billing' }));
//     }
//
//     // get CORS data for the update billing context
//     return dispatch(cors({ context: 'update-billing', onSuccess: updateZuoraCC }));
//   };
// }



export default function billingUpdate(values) {
  return (dispatch) => {
    // const actions =
    //   [ //action, onSuccess
    //     [ corsThenUpdateZuora, updateZuoraCC ],
    //     [ updateZuoraCC, maybeChangePlan ],
    //     [ maybeChangePlan, syncSubscription ],
    //     [ syncSubscription, collectPayments ],
    //     [ collectPayments, refreshAccount ],
    //     [ refreshAccount]
    //   ];

    const actions =
      [ //action, onSuccess
        [corsThenUpdateZuora, updateZuoraCC],
        [updateZuoraCC]
      ];

    return chainActions(actions);

    function corsThenUpdateZuora({ meta }) {
      return cors({ context: 'update-billing', meta });
    }

    function updateZuoraCC({ meta, getState, results: { accountKey, token, signature }}) {
      console.log(accountKey);
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

    function maybeChangePlan({ dispatch }) {
      if (values.planpicker) {
        dispatch(updateSubscription({ code: values.planpicker.code }));
      }
    }

    function refreshAccount({ dispatch }) {
      dispatch(fetchAccount({ include: 'usage,billing' }));
    }

    function snycThenCollect() {
      return syncSubscription({ meta: { onSuccess: collectPayments }});
    }
  };
}




/**
returns
() => actionA({ onSuccess: (results) =>
        actionB({ results, onSuccess: (results) =>
            actionC({ results, onSuccess: (results) =>
                actionD({ results }) })})});
**/

function chainActions(actions) {
  let current = actions[0][0];

  const reduced = actions.reduce((results, next) => {
    console.log(next);
    let result;
    if (current) {
      console.log('current', current.name);
      return result = current({ results, meta: { onSuccess: next[1] }});
      console.log('result of ', current.name, ' ', result);
    }
    current = next[1]; // set the next action to be called
    console.log('next up is ', current ? current.name : 'nothing!');
    return result;
  }, undefined);

  console.log(reduced);
  return reduced;
}
