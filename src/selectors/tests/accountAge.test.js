import selectAccountAgeInWeeks from '../accountAge';

describe('Selectors: accountAge', () => {
  // mock date so we can control relative age in snapshot
  Date.now = jest.fn(() => 1512509841582);
  const state = {
    account: {
      created: '2017-11-15T10:00:00.000Z'
    }
  };

  it('returns account age in weeks', () => {
    expect(selectAccountAgeInWeeks(state)).toMatchSnapshot();
  });
});

