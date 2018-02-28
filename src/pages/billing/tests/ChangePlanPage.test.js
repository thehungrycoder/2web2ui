import React from 'react';
import { ChangePlanPage } from '../ChangePlanPage';
import { shallow } from 'enzyme';

jest.mock('src/actions/billing');

describe('Page: ChangePlanPage', () => {
  let wrapper;

  const props = {
    loading: false,
    account: {},
    getPlans: jest.fn(),
    getBillingCountries: jest.fn()
  };

  beforeEach(() => {
    wrapper = shallow(<ChangePlanPage {...props} />);
  });

  it('should get plans and countries on mount', () => {
    const plansSpy = jest.spyOn(wrapper.instance().props, 'getPlans');
    const countrySpy = jest.spyOn(wrapper.instance().props, 'getBillingCountries');
    wrapper.instance().componentWillMount();
    expect(plansSpy).toHaveBeenCalled();
    expect(countrySpy).toHaveBeenCalled();
  });

  it('should render form if allowed to change plan', () => {
    wrapper.setProps({ canChangePlan: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render form if not allowed to change plan', () => {
    wrapper.setProps({ canChangePlan: false });
    expect(wrapper).toMatchSnapshot();
  });

  it('should show loading component while loading data', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });
});
