import { overviewProps } from '../accountBillingInfo';

describe('Selector: Get Account Overview Info', () => {

  let store;

  beforeEach(() => {
    store = {
      account: {
        subscription: {
          plan: 'test plan',
          code: 'test-plan-0817',
          self_serve: true
        },
      },
      billing: {
        plansLoading: false,
        plans: [
          {
            code: 'test-plan-0817',
            status: 'public',
            volume: 5000000
          },
        ]
      }
    };
  })

  it('should return the selected data for a customer with a billing account', () => {
    expect(overviewProps(store)).toMatchSnapshot();
  });
});
