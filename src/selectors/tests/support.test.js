import entitledToSupport from '../support';

describe('Selectors: support', () => {
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
