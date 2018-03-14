import { formatCountries, formatCardTypes, getPlanPrice } from '../billing';

describe('Billing Helpers', () => {
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




