import React from 'react';
import { PendingPlanBanner, PremiumBanner, EnterpriseBanner, FreePlanWarningBanner } from '../Banners';
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

  describe('Free Plan Downgrade warning banner', () => {
    let wrapper;
    const props = {
      account: {
        subscription: {
          code: 'free15K-plan'
        }
      },
      accountAgeInDays: 16,
      ageRangeStart: 16,
      ageRangeEnd: 30
    };
    beforeEach(() => {
      wrapper = shallow(<FreePlanWarningBanner {...props} />);
    });

    it('renders', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('renders correct text on last day of plan', () => {
      wrapper.setProps({
        accountAgeInDays: 29.5
      });
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render if past 30 days of creation date', () => {
      wrapper.setProps({
        accountAgeInDays: 31
      });
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render if days account age is greater than ageRangeEnd', () => {
      wrapper.setProps({
        accountAgeInDays: 31,
        ageRangeEnd: 20
      });
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render if days acount age is less than ageRangeStart', () => {
      wrapper.setProps({
        accountAgeInDays: 20,
        ageRangeStart: 23
      });
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render anything if pending plan change', () => {
      wrapper.setProps({
        account: {
          ...props.account,
          pending_subscription: true
        }
      });
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render if current plan does not include free15K', () => {
      wrapper.setProps({
        account: {
          ...props.account,
          subscription: {
            code: 'free500-plan'
          }
        }
      });
      expect(wrapper).toMatchSnapshot();
    });
  });
});
