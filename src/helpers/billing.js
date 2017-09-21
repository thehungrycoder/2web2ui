import _ from 'lodash';

export function formatDataForCors(values) {
  const {
    firstName,
    lastName,
    cardType,
    cardNumber,
    expirationMonth,
    expirationYear,
    cardHolderName,
    securityCode,
    email,
    address1,
    address2,
    city,
    state,
    country,
    zipCode,
    selectedPlan
  } = values;

  // For CORS Endpoint + sift
  const corsData = {
    email,
    cardholder_name: cardHolderName,
    address1,
    address2,
    city,
    state,
    country,
    zip_code: zipCode,
    bin: cardNumber.slice(0, 6),
    last_four: cardNumber.slice(-4),
    plan_id: selectedPlan.billingId
  };

  // For Zuora
  const billingData = {
    billingId: selectedPlan.billingId,
    billToContact: {
      firstName,
      lastName,
      workEmail: email,
      country,
      state
    },
    creditCard: {
      cardType,
      cardNumber,
      expirationMonth,
      expirationYear,
      securityCode,
      cardHolderInfo: {
        cardHolderName: cardHolderName,
        addressLine1: address1,
        addressLine2: address2,
        city,
        zipCode
      }
    }
  };

  return { corsData, billingData };
}

export function formatCreateData({
  accountNumber,
  crmId,
  name,
  contractEffectiveDate,
  discountId = false,
  billingId,
  creditCard,
  billToContact
}) {
  const formatted = {
    accountNumber,
    autoPay: true,
    crmId,
    currency: 'USD',
    invoiceCollect: true,
    name,
    subscription: {
      contractEffectiveDate,
      subscribeToRatePlans: [{ productRatePlanId: billingId }],
      termType: 'EVERGREEN'
    },
    creditCard,
    billToContact
  };

  if (discountId) {
    formatted.subscription.subscribeToRatePlans.push({ productRatePlanId: discountId });
  }

  return formatted;
}

// Formats countries before storing in state
export function formatCountries(countries) {
  const ordered = _.flatten([
    _.remove(countries, { code: 'US' }),
    _.remove(countries, { code: 'GB' }),
    _.remove(countries, { code: 'CA' }),
    countries
  ]);

  return ordered.map((country) => formatForSelect(country));
}

function formatForSelect({ code, name, states }) {
  if (states) {
    return { value: code, label: name, states: states.map((state) => formatForSelect(state)) };
  }
  return { value: code, label: name };
}

export function getZipLabel(country) {
  if (country === 'US') {
    return 'Zip Code';
  }

  if (country === 'CA') {
    return 'Postal Code';
  }

  return 'Zip/Postal Code';
}
