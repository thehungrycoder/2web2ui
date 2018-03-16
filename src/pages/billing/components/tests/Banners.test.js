import React from 'react';
import { PendingPlanBanner, ManuallyBilledBanner, PremiumBanner, EnterpriseBanner } from '../Banners';
import { shallow } from 'enzyme';

describe('Billing Banners: ', () => {
  it('PendingPlanBanner should render with pending_subscription', () => {
    const props = {
      account: {
        pending_subscription: { effective_date: '10/5/2020' }
      }
    };
    const wrapper = shallow(<PendingPlanBanner {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('ManuallyBilledBanner should render with subscription', () => {
    const props = {
      account: {
        subscription: {
          name: 'whoa',
          plan_volume: 123
        }
      }
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
      }
    };
    const wrapper = shallow(<ManuallyBilledBanner {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('ManuallyBilledBanner should not render if self-serve', () => {
    const props = {
      account: { subscription: { self_serve: true }}
    };
    const wrapper = shallow(<ManuallyBilledBanner {...props} />);
    expect(wrapper.find('t')).not.toBePresent();
  });

  it('renders Premium banner', () => {
    const wrapper = shallow(<PremiumBanner />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders Enterprise banner', () => {
    const wrapper = shallow(<EnterpriseBanner />);
    expect(wrapper).toMatchSnapshot();
  });
});
