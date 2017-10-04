import { overviewProps, selectPublicPlans, selectCurrentPlan, selectIpPools } from '../accountBillingInfo';

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

describe('Selector: public plans', () => {
  const store = {
    billing: {
      plans: [
        { status: 'public', volume: 1 },
        { status: 'public', volume: 3 },
        { status: 'private', volume: 4 },
        { status: 'public', volume: 2 },
      ]
    }
  }

  it('should get public plans and sort by volume', () => {
    expect(selectPublicPlans(store)).toMatchSnapshot();
  });
});

describe('Selector: current plan', () => {
  const store = {
    account: { subscription: { code: 'qwe' }},
    billing: {
      plans: [
        { status: 'public', code: '123' },
        { status: 'private', code: 'qwe' },
      ]
    }
  }

  it('should get current plan from billing', () => {
    expect(selectCurrentPlan(store)).toMatchSnapshot();
  });
});

describe('IP Pool List Selector', () => {
  const store = {
    ipPools: {
      list: [
        { id: 'ip_id', name: 'IP Name', },
        { id: 'default', name: 'IP Name2', }
      ]
    }
  }

  it('should format IP Pools for select options', () => {
    expect(selectIpPools(store)).toMatchSnapshot();
  });

  it('should return empty array with no IP Pools', () => {
    store.ipPools = {};
    expect(selectIpPools(store)).toMatchSnapshot();
  });
});
