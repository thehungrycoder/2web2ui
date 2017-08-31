import { formatDataForCors } from './helpers/billing';

const apiBase = 'https://apisandbox-api.zuora.com/rest/v1';

export function updateSubscription(code) {
  return {
    type: 'SPARKPOST_API_REQUEST',
    meta: {
      type: 'UPDATE_SUBSCRIPTION',
      method: 'PUT',
      url: '/account/subscription',
      data: { code }
    }
  };
}

export function billingCreate(values) {
  const createData = formatDataForCors(values);
  const { corsData, billingData } = createData;

  return (dispatch) => {
    const cb = ({ results }) => {
      const accountData = {
        accountNumber: results.accountNumber,
        autoPay: true,
        crmId: results.crmId,
        currency: 'USD',
        invoiceCollect: true,
        name: results.name,
        subscription: {
          contractEffectiveDate: results.contractEffectiveDate,
          subscribeToRatePlans: [{ productRatePlanId: billingData.billingId }],
          termType: 'EVERGREEN'
        }
      };

      if (results.discountId) {
        accountData.subscription.subscribeToRatePlans.push({ productRatePlanId: results.discountId });
      }

      accountData.creditCard = billingData.creditCard;
      accountData.billToContact = billingData.billToContact;

      dispatch({
        type: 'GENERAL_REQUEST',
        meta: {
          type: 'ZUORA_CREATE',
          method: 'POST',
          url: `${apiBase}/accounts`,
          data: accountData,
          headers: {
            token: results.token,
            signature: results.signature
          }
        }
      });
    };

    dispatch({
      type: 'SPARKPOST_API_REQUEST',
      meta: {
        type: 'CORS_CREATE',
        method: 'POST',
        url: '/account/cors-data',
        params: { context: 'create-account' },
        data: corsData,
        onSuccess: cb
      }
    });
  };
}

export function getBillingCountries() {
  return {
    type: 'SPARKPOST_API_REQUEST',
    meta: {
      type: 'GET_COUNTRIES_BILLING',
      method: 'GET',
      url: '/account/countries',
      params: {
        filter: 'billing'
      }
    }
  };
}
