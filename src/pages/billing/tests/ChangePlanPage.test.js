import React from 'react';
import { ChangePlanPage } from '../ChangePlanPage';
import { shallow } from 'enzyme';

jest.mock('src/actions/billing');

describe('Page: ChangePlanPage', () => {
  let wrapper;

  const props = {
    loading: false,
    account: {},
    fetchAccount: jest.fn(),
    getPlans: jest.fn(),
    getBillingCountries: jest.fn()
  };

  beforeEach(() => {
    wrapper = shallow(<ChangePlanPage {...props} />);
  });

  it('should render form if allowed to change plan', () => {
    wrapper.setProps({ canChangePlan: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render form if not allowed to change plan', () => {
    wrapper.setProps({ canChangePlan: false });
    expect(wrapper).toMatchSnapshot();
  });
});
