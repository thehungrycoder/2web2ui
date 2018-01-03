import entitledToSupport from '../support';

describe('Selectors: support', () => {
  const state = {
    account: {
      created: '2017-11-15T10:00:00.000Z'
    }
  };

  it('when account is not loaded', () => {
    const state = {
      account: {}
    };
    expect(entitledToSupport(state)).toBeFalsy();
  });

  it('when account is not entitled to online support', () => {
    const state = {
      account: {
        support: {
          online: false,
          phone: true
        }
      }
    };
    expect(entitledToSupport(state)).toBeFalsy();
  });

  it('when account entitled to online support', () => {
    const state = {
      account: {
        support: {
          online: true,
          phone: false
        }
      }
    };
    expect(entitledToSupport(state)).toBeTruthy();
  });
});
