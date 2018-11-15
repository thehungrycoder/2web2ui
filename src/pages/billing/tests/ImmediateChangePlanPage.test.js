import React from 'react';
import { shallow } from 'enzyme';
// import * as conversions from 'src/helpers/conversionTracking';

import { ImmediateChangePlanPage, LOAD_STATE } from '../ImmediateChangePlanPage';

const plans = [
  {
    isFree: false,
    code: 'no-free-as-in-gold',
    volume: 15000
  },
  {
    isFree: true,
    code: 'so-very-free',
    volume: 100000
  }
];

jest.mock('src/helpers/conversionTracking');

describe('Component: ImmediateChangePlanPage', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      oldCode: 'not-free-as-in-gold',
      billing: { countries: [], plans },
      history: { push: jest.fn() },
      location: {
        pathname: '/account/billing/plan/change',
        search: 'immediatePlanChange=so-very-free&pass=through'
      },
      updateSubscription: jest.fn(() => Promise.resolve()),
      showAlert: jest.fn()
    };
    wrapper = shallow(<ImmediateChangePlanPage {...props} />);
  });

  it('should handle plan change immediately', async () => {
    props.immediatePlanChange = 'so-very-free';
    wrapper = shallow(<ImmediateChangePlanPage {...props} />);
    await wrapper;

    expect(props.updateSubscription).toHaveBeenCalledWith({ code: 'so-very-free' });
  });

  it('should not change plan without immediatePlanChange', async () => {
    expect(props.updateSubscription).not.toHaveBeenCalled();
  });

  it('should redirect to billing without immediatePlanChange', () => {
    expect(props.history.push).toHaveBeenCalledWith({
      pathname: '/account/billing',
      search: 'pass=through'
    });
  });

  it('should render while changing plan', () => {
    wrapper.setState({ loading: LOAD_STATE.PENDING });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render after plan changed', () => {
    wrapper.setState({ loading: LOAD_STATE.SUCCESS });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render after plan change failed', async () => {
    props.immediatePlanChange = 'so-very-free';
    props.updateSubscription.mockRejectedValue(new Error('oopsie'));
    wrapper = shallow(<ImmediateChangePlanPage {...props} />);
    await wrapper;
    expect(wrapper).toMatchSnapshot();
  });

  it('should allow retries after failure', () => {
    wrapper.setState({ loading: LOAD_STATE.FAILURE, error: { message: 'boom' }});
    const reloadFn = wrapper.find('ApiErrorBanner').first().prop('reload');
    reloadFn();
    expect(props.updateSubscription).toHaveBeenCalled();
  });
});
