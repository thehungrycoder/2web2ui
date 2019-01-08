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
          code: 'free15K-1018'
        },
        created: Date.now()
      }
    };
    beforeEach(() => {
      wrapper = shallow(<FreePlanWarningBanner {...props} />);
    });

    it('renders', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render anything if date is past', () => {
      wrapper.setProps({ account: { ...props.account, created: new Date(2010) }});
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render if current plan is not free15K-1018', () => {
      wrapper.setProps({
        account: {
          ...props.account,
          subscription: {
            code: 'not-free15K-1018'
          }
        }
      });
      expect(wrapper).toMatchSnapshot();
    });
  });
});
