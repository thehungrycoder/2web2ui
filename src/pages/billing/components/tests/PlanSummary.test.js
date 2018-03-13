import React from 'react';
import { shallow } from 'enzyme';
import PlanSummary from '../PlanSummary';

describe('Component: PlanSummary', () => {

  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      plan: {
        overage: 0.01,
        monthly: 100000,
        volume: 100000000
      }
    };
    wrapper = shallow(<PlanSummary {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with no monthly value', () => {
    delete props.plan.monthly;
    wrapper.setProps({ plan: props.plan });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with 0 monthly value', () => {
    props.plan.monthly = 0;
    wrapper.setProps({ plan: props.plan });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with no overage value', () => {
    delete props.plan.overage;
    wrapper.setProps({ plan: props.plan });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with no volume value', () => {
    delete props.plan.volume;
    wrapper.setProps({ plan: props.plan });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with no plan', () => {
    wrapper.setProps({ plan: undefined });
    expect(wrapper).toMatchSnapshot();
  });

});
