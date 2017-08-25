const apiBase = 'https://apisandbox-api.zuora.com/rest/v1';

export function testAction () {
  return {
    type: 'GENERAL_REQUEST',
    meta: {
      type: 'TEST',
      method: 'GET',
      url: 'http://httpbin.org/status/200'
    }
  };
}

// TODO: old webui stuff, need to refactor
// function formatForZuora(data, corsData) {
//   var dataForZuora = {
//     accountNumber: corsData.accountNumber,
//     autoPay: true,
//     crmId: corsData.crmId,
//     currency: 'USD',
//     invoiceCollect: true,
//     name: corsData.name,
//     subscription: {
//       contractEffectiveDate: corsData.contractEffectiveDate,
//       subscribeToRatePlans: [{ productRatePlanId: data.planId }],
//       termType: 'EVERGREEN'
//     }
//   };
//
//   if (corsData.discountId) {
//     dataForZuora.subscription.subscribeToRatePlans.push({ productRatePlanId: corsData.discountId });
//   }
//
//   dataForZuora.creditCard = formatCreditCard(data.creditCard);
//   dataForZuora.billToContact = formatBillingData(data.billToContact);
//
//   if (data.useBilling) {
//     accountData.creditCard.cardHolderInfo = _.pick(accountData.billToContact, ['city', 'state', 'country', 'zipCode']);
//     accountData.creditCard.cardHolderInfo.addressLine1 = data.billToContact.address1;
//     accountData.creditCard.cardHolderInfo.addressLine2 = data.billToContact.address2;
//     accountData.creditCard.cardHolderInfo.cardHolderName = data.cardHolderInfo.cardHolderName;
//   } else {
//     accountData.creditCard.cardHolderInfo = formatCardholderInfo(data.cardHolderInfo);
//   }
//
//
//   return accountData;
// }

// TODO: old webui stuff, need to refactor
// function formatCreditCard(ccData) {
//   var creditCard = _.cloneDeep(ccData);
//   creditCard = _.pick(creditCard, ['cardNumber', 'securityCode', 'expirationMonth', 'expirationYear']);
//   creditCard.cardType = ccData.cardType.code || ccData.cardType;
//   if (creditCard.expirationMonth.code) {
//     creditCard.expirationMonth = creditCard.expirationMonth.code;
//   }
//   return creditCard;
// }

export function billingCreate (data, accountData) {
  return (dispatch) => {
    const cb = ({ results }) => {
      console.log(results);
      // dispatch({
      //   type: 'GENERAL_REQUEST',
      //   meta: {
      //     url: apiBase + '/accounts',
      //     data: formatForZuora(results, accountData),
      //     headers: {
      //       results.token,
      //       results.signature
      //     }
      //   }
      // })
    };

    dispatch({
      type: 'SPARKPOST_API_REQUEST',
      meta: {
        type: 'CORS_CREATE',
        method: 'POST',
        url: '/account/cors-data',
        params: { context: 'create-account' },
        data: data,
        onSuccess: cb
      }
    });
  };
}
