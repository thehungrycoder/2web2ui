import React from 'react';
import { PendingPlanBanner, PremiumBanner, EnterpriseBanner } from '../Banners';
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

  describe('Premium banner', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<PremiumBanner />);
    });

    it('renders', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly for aws users', () => {
      wrapper.setProps({ isAWSAccount: true });
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
