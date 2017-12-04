import selectAccountAgeInWeeks from '../accountAge';

describe('Selectors: accountAge', () => {
  const state = {
    account: {
      created: '2017-11-15T10:00:00.000Z'
    }
  };

  it('returns account age in weeks', () => {
    expect(selectAccountAgeInWeeks(state)).toMatchSnapshot();
  });
});

