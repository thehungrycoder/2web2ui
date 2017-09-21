import selector from '../accountBillingInfo';

describe('Selector: Get Account Billing Info', () => {

  let store;

  beforeEach(() => {
    store = {
      account: {
        subscription: {
          plan: 'test plan',
          code: 'test-plan-0817',
          self_serve: true
        }
      }
    };
  })

  it('should return the selected data for a customer with a billing account', () => {
    store.account.billing = {};
    expect(selector(store)).toMatchSnapshot();
  });

  it('should return the selected data for a customer with no billing account', () => {
    expect(selector(store)).toMatchSnapshot();
  });
});
