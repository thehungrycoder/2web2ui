/* eslint max-lines: ["error", 200] */
import _ from 'lodash';
import config from 'src/config';
import Payment from 'payment';
import qs from 'query-string';

export function formatDataForCors(values) {
  const { email, planpicker, card, billingAddress, discountId } = values;

  // For CORS Endpoint + sift
  const corsData = {
    email,
    cardholder_name: card.name,
    state: billingAddress.state,
    country: billingAddress.country,
    zip_code: billingAddress.zip,
    bin: card.number.slice(0, 6),
    last_four: card.number.slice(-4),
    plan_id: planpicker.billingId,
    address1: null,
    address2: null,
    city: null
  };

  // For Zuora
  const billingData = {
    billingId: planpicker.billingId,
    billToContact: {
      firstName: billingAddress.firstName,
      lastName: billingAddress.lastName,
      workEmail: email,
      country: billingAddress.country,
      state: billingAddress.state,
      zipCode: billingAddress.zip
    },
    creditCard: {
      cardType: card.type,
      cardNumber: card.number,
      expirationMonth: card.expMonth,
      expirationYear: card.expYear,
      securityCode: card.securityCode,
      cardHolderInfo: {
        cardHolderName: card.name,
        zipCode: billingAddress.zip,
        addressLine1: null,
        addressLine2: null,
        city: null,
        country: billingAddress.country // must send country so gateway knows which AVS rules to apply
      }
    },
    discountId
  };
  return { corsData, billingData };
}

export function formatUpdateData({ accountKey, billingAddress, card }) {
  const { securityCode } = card;
  const { zip, country, state } = billingAddress;
  return {
    accountKey,
    defaultPaymentMethod: true,
    cardHolderInfo: {
      cardHolderName: card.name,
      zipCode: zip,
      country,
      state,
      addressLine1: null,
      addressLine2: null,
      city: null
    },
    creditCardNumber: card.number.replace(/\W/g, ''),
    expirationMonth: card.expMonth,
    expirationYear: card.expYear,
    securityCode,
    creditCardType: card.type
  };
}

export function formatCreateData({
  accountNumber,
  crmId,
  name,
  contractEffectiveDate,
  discountId = false,
  billingId,
  creditCard,
  billToContact,
  invoiceCollect = true
}) {
  const formatted = {
    accountNumber,
    autoPay: true,
    crmId,
    currency: 'USD',
    invoiceCollect,
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

export function formatContactData({ billingContact }) {
  return {
    email: billingContact.email,
    first_name: billingContact.firstName,
    last_name: billingContact.lastName,
    country_code: billingContact.country,
    zip_code: billingContact.zip,
    state: billingContact.state
  };
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

/**
 * Reshapes type strings from what the payment lib provides to a format our api accepts
 */
export function formatCardTypes(cards) {
  return cards.map((card) => {
    const type = _.find(config.cardTypes, { paymentFormat: card.type });
    return { ...card, type: type ? type.apiFormat : card.type };
  });
}


export function getPlanPrice(plan) {
  const pricingInterval = _.has(plan, 'hourly') ? 'hourly' : 'monthly';
  const intervalShortName = pricingInterval === 'hourly' ? 'hr' : 'mo';
  return { intervalShort: intervalShortName, intervalLong: pricingInterval, price: plan[pricingInterval] };
}

export function prepareCardInfo({ expCombined, ...cardInfo }) {
  const expiryInfo = Payment.fns.cardExpiryVal(expCombined);

  return {
    ...cardInfo,
    type: Payment.fns.cardType(cardInfo.number),
    expMonth: expiryInfo.month,
    expYear: expiryInfo.year
  };
}

export function stripImmediatePlanChange(search) {
  const { immediatePlanChange, ...options } = qs.parse(search);
  return qs.stringify(options);
}
