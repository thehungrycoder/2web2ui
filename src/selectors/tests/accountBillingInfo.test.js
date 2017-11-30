import * as billingInfo from '../accountBillingInfo';
import * as mockConfig from 'src/config';

jest.mock('src/config', () => ({ sendingIps: { awsPricePerIp: 0.0011, pricePerIp: 10 } }));

describe('Selector: public plans', () => {
  const store = {
    billing: {
      plans: [
        { status: 'public', volume: 1 },
        { status: 'public', volume: 3 },
        { status: 'private', volume: 4 },
        { status: 'public', volume: 2 }
      ]
    }
  };

  it('should get public plans and sort by volume', () => {
    expect(billingInfo.publicPlansSelector(store)).toMatchSnapshot();
  });
});

describe('Selector: current plan', () => {
  const store = {
    account: { subscription: { code: 'qwe' }},
    billing: {
      plans: [
        { status: 'public', code: '123' },
        { status: 'private', code: 'qwe' }
      ]
    }
  };

  it('should get current plan from billing', () => {
    expect(billingInfo.currentPlanSelector(store)).toMatchSnapshot();
  });
});

describe('Selector: should expose card', () => {
  const store = {
    account: { subscription: { code: 'qwe' }, billing: {}},
    billing: {
      plans: [
        { status: 'public', code: '123' },
        { status: 'public', code: 'qwe', isFree: false }
      ]
    }
  };

  it('should return true if on paid plan', () => {
    expect(billingInfo.shouldExposeCardSelector(store)).toEqual(true);
  });
});

describe('Selector: can change plan', () => {
  it('should return false with a suspension', () => {
    const store = {
      account: { isSuspendedForBilling: true }
    };

    expect(billingInfo.canChangePlanSelector(store)).toEqual(false);
  });

  it('should return false with a pending plan change', () => {
    const store = {
      account: { pending_subscription: {}}
    };

    expect(billingInfo.canChangePlanSelector(store)).toEqual(false);
  });
});

describe('IP Pool List Selector', () => {
  const store = {
    ipPools: {
      list: [
        { id: 'ip_id', name: 'IP Name' },
        { id: 'default', name: 'IP Name2' }
      ]
    }
  };

  it('should format IP Pools for select options', () => {
    expect(billingInfo.selectIpPools(store)).toMatchSnapshot();
  });

  it('should return empty array with no IP Pools', () => {
    store.ipPools = {};
    expect(billingInfo.selectIpPools(store)).toMatchSnapshot();
  });
});
