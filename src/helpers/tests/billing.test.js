import {
  formatCountries,
  formatCardTypes,
  formatDataForCors,
  getPlanPrice
} from '../billing';

describe('Billing Helpers', () => {

  describe('formatDataForCors', () => {
    const card = {
      number: '4123512361237123',
      name: 'Person Face',
      type: 'CardType',
      expMonth: 4,
      expYear: 2050,
      securityCode: 123
    };
    const billingAddress = {
      state: 'MD',
      country: 'US',
      zip: '21234',
      firstName: 'Person',
      lastName: 'Head'
    };
    const planpicker = {
      billingId: 'testBillingId135'
    };
    const values = {
      email: 'someemail@example.com',
      planpicker,
      card,
      billingAddress
    };

    it('should return the correctly formatted values', () => {
      const formatted = formatDataForCors(values);
      expect(formatted).toMatchSnapshot();
      // country is especially important here for AVS, see FAD-6500
      expect(formatted.billingData.creditCard.cardHolderInfo.country).toEqual('US');
    });
  });

  describe('formatCountries', () => {
    const countries = [
      { code: 'GG', name: 'gg' },
      { code: 'CA', name: 'Canada' },
      { code: 'US', name: 'USOFA', states: [{ code: 'MD', name: 'maryland' }, { code: 'NY', name: 'new york' }]},
      { code: 'GB', name: 'United Kingdom' },
      { code: 'EZ', name: 'ez' }
    ];

    it('should reorder and format countries for select options', () => {
      expect(formatCountries(countries)).toMatchSnapshot();
    });
  });

  describe('formatCardTypes', () => {
    const types = [
      { type: 'visa' },
      { type: 'mastercard' },
      { type: 'amex' },
      { type: 'discover' },
      { type: 'bUtNoTtHiSoNe' }
    ];

    it('should format card type strings', () => {
      expect(formatCardTypes(types)).toMatchSnapshot();
    });
  });

  describe('getPlanPrice', () => {
    const monthly = {
      monthly: 50,
      volume: 500
    };

    const hourly = {
      hourly: 0.25,
      volume: 600
    };

    it('returns price info correctly for monthly plan', () => {
      expect(getPlanPrice(monthly)).toMatchSnapshot();
    });

    it('returns price info correctly for hourly plan', () => {
      expect(getPlanPrice(hourly)).toMatchSnapshot();
    });
  });
});




