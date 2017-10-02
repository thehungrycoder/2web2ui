import React from 'react';
import { PendingPlanBanner, SuspendedBanner, ManuallyBilledBanner } from '../Banners';
import { shallow } from 'enzyme';

describe('Billing Banners: ', () => {
  it('PendingPlanBanner should render with pending_subscription', () => {
    const props = {
      account: {
        pending_subscription: { effective_date: '10/5/2020' }
      },
    };
    const wrapper = shallow(<PendingPlanBanner {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('SuspendedBanner should render with isSuspendedForBilling', () => {
    const props = {
      account: {
        isSuspendedForBilling: true,
        billing: { email: 'tst' }
      },
    };
    const wrapper = shallow(<SuspendedBanner {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('ManuallyBilledBanner should render with subscription', () => {
    const props = {
      account: {
        subscription: {
          name: 'whoa',
          plan_volume: 123
        }
      },
    };
    const wrapper = shallow(<ManuallyBilledBanner {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('ManuallyBilledBanner should render with pending subscription', () => {
    const props = {
      account: {
        subscription: {
          name: 'whoa',
          plan_volume: 123
        },
        pending_subscription: {
          name: 'omg',
          effective_date: '10/5/2020'
        }
      },
    };
    const wrapper = shallow(<ManuallyBilledBanner {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('ManuallyBilledBanner should not render if self-serve', () => {
    const props = {
      account: { subscription: { self_serve: true } }
    };
    const wrapper = shallow(<ManuallyBilledBanner {...props} />);
    expect(wrapper.find('t')).not.toBePresent();
  });
});
