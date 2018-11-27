import React from 'react';
import { shallow } from 'enzyme';
import PlanPrice from '../PlanPrice';

describe('PlanPrice', () => {
  let wrapper;
  let plan;

  beforeEach(() => {
    plan = {
      monthly: 9,
      volume: 50000,
      overage: 0.75
    };

    const props = {
      plan
    };

    wrapper = shallow(<PlanPrice {...props} />);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders with overage', () => {
    wrapper.setProps({ showOverage: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('allows class name overriding', () => {
    wrapper.setProps({ className: 'abcd-class' });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly with hourly plans', () => {
    delete plan.monthly;
    plan.hourly = 0.012;

    wrapper.setProps({ plan });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders free ip', () => {
    plan.includesIp = true;
    wrapper.setProps({ plan, showIp: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders free ip and overage correct', () => {
    plan.includesIp = true;
    wrapper.setProps({ plan, showIp: true, showOverage: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders nothing when no plan', () => {
    wrapper.setProps({ plan: {}});
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly for free plan', () => {
    plan.monthly = 0;
    plan.isFree = true;
    wrapper.setProps({ plan });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly for CSM inclusion', () => {
    plan.includesCsm = true;
    wrapper.setProps({ plan, showCsm: true });
    expect(wrapper).toMatchSnapshot();
  });
});
