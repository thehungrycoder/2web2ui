import { shallow } from 'enzyme';
import React from 'react';

import Plan from '../Plan';

describe('Plan:', () => {

  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      plan: {
        monthly: 100,
        overage: 0.9,
        volume: 200
      }
    };

    wrapper = shallow(<Plan {...props} />);
  });
  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders free and ip correctly', () => {
    const plan = {
      monthly: 0,
      isFree: true,
      overage: 0.8,
      includesIp: true,
      volume: 300
    };
    wrapper.setProps({ plan });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders hourly plan correctly', () => {
    const plan = {
      hourly: 0.22,
      overage: 0.8,
      includesIp: true,
      volume: 300
    };
    wrapper.setProps({ plan });
    expect(wrapper).toMatchSnapshot();
  });

});
