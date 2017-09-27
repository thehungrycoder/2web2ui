/* eslint-disable */
import _ from 'lodash';

export function formatDataForCors(values) {
  const { email, planpicker, card, billingAddress, billingContact } = values;

  // For CORS Endpoint + sift
  const corsData = {
    email,
    cardholder_name: card.name,
    address1: billingAddress.streetAddress,
    // address2: '',
    // city: '',
    state: billingAddress.state,
    country: billingAddress.country,
    zip_code: billingAddress.zip,
    bin: card.number.slice(0, 6),
    last_four: card.number.slice(-4),
    plan_id: planpicker.billingId
  };


  // For Zuora
  const billingData = {
    billingId: planpicker.billingId,
    billToContact: {
      firstName: billingAddress.firstName,
      lastName: billingAddress.lastName,
      workEmail: email,
      country: billingAddress.country,
      state: billingAddress.state
    },
    creditCard: {
      cardType: card.type,
      cardNumber: card.number,
      expirationMonth: card.expMonth,
      expirationYear: card.expYear,
      securityCode: card.securityCode,
      cardHolderInfo: {
        cardHolderName: card.name,
        addressLine1: billingAddress.streetAddress,
        // addressLine2: 'TEST',
        // city: 'TEST',
        zipCode: billingAddress.zip
      }
    }
  }

  // // For Zuora
  // const billingData = {
  //   billingId: selectedPlan.billingId,
  //   billToContact: {
  //     firstName,
  //     lastName,
  //     workEmail: email,
  //     country,
  //     state
  //   },
  //   creditCard: {
  //     cardType,
  //     cardNumber,
  //     expirationMonth,
  //     expirationYear,
  //     securityCode,
  //     cardHolderInfo: {
  //       cardHolderName: cardHolderName,
  //       addressLine1: address1,
  //       addressLine2: address2,
  //       city,
  //       zipCode
  //     }
  //   }
  // };

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

// What api accepts
// 'creditCard.cardType' value should be one of:
//  Visa,
//  MasterCard,
//  AmericanExpress,
//  Discover,
//  JCB,
//  Diners,
//  - CUP,
//  Maestro,
//  -Electron,
//  -AppleVisa,
//  -AppleMasterCard,
//  -AppleAmericanExpress,
//  -AppleDiscover,
//  -AppleJCB

// What payment provides by default
// visa (available in old ui select)
// mastercard (available in old ui select)
// discover (available in old ui select)
// amex (available in old ui select)
// dankort
// visaelectron
// jcb
// dinersclub
// maestro
// laser
// unionpay
// elo
// hipercard
const acceptedCardTypes = [
  { paymentFormat: 'visa', apiFormat: 'Visa' },
  { paymentFormat: 'mastercard', apiFormat: 'MasterCard' },
  { paymentFormat: 'amex', apiFormat: 'AmericanExpress' },
  { paymentFormat: 'discover', apiFormat: 'Discover' }
];

/**
 * Removes unused card types from payment card array and formats the type string for our api
 */
export function convertCardTypes(cards) {
  const accepted = cards.filter((card) => _.find(acceptedCardTypes, { paymentFormat: card.type }));
  return accepted.map((card) => ({ ...card, type: _.find(acceptedCardTypes, { paymentFormat: card.type }).apiFormat }));
}
