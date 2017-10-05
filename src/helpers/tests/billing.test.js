import { formatCountries, formatCardTypes } from '../billing';

describe('Helper: Billing Countries', () => {
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

describe('Helper: Card Types', () => {
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
