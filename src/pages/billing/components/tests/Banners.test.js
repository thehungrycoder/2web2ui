import React from 'react';
import { PendingPlanBanner, ManuallyBilledBanner, PremiumBanner, EnterpriseBanner } from '../Banners';
import * as conversions from 'src/helpers/conversionTracking';
import * as constants from 'src/constants';
import { shallow } from 'enzyme';

jest.mock('src/helpers/conversionTracking');

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
    expect(wrapper.find('t')).not.toExist();
  });

  describe('Premium banner', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<PremiumBanner />);
    });

    it('renders', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('tracks addon request', () => {
      wrapper.prop('action').onClick();
      expect(conversions.trackAddonRequest).toHaveBeenCalledWith(constants.ANALYTICS_PREMIUM_SUPPORT);
    });
  });

  describe('Enterprise banner', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<EnterpriseBanner />);
    });

    it('renders', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('tracks addon request', () => {
      wrapper.prop('action').onClick();
      expect(conversions.trackAddonRequest).toHaveBeenCalledWith(constants.ANALYTICS_ENTERPRISE_SUPPORT);
    });
  });
});
