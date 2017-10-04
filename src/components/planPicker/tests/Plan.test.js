import { shallow } from 'enzyme';
import React from 'react';

import Plan from '../Plan';

describe('Plan: ', () => {

  it('renders correctly', () => {
    const props = {
      plan: {
        monthly: 100,
        overage: 0.9,
        volume: 200
      }
    };
    const wrapper = shallow(<Plan {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders free and ip correctly', () => {
    const props = {
      plan: {
        monthly: 0,
        isFree: true,
        overage: 0.8,
        includesIp: true,
        volume: 300
      }
    };
    const wrapper = shallow(<Plan {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

});
