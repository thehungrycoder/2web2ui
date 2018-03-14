import React from 'react';
import { shallow } from 'enzyme';

import PlanPicker from '../PlanPicker';

describe('Plan Picker: ', () => {
  let wrapper;

  beforeEach(() => {
    const plans = [
      {
        code: '1',
        includesIp: true,
        monthly: 100,
        name: 'One',
        overage: 0.1,
        volume: 1
      },
      {
        code: '2',
        includesIp: false,
        monthly: 0,
        name: 'Two',
        overage: 0.2,
        volume: 2,
        isFree: true
      },
      {
        code: '3',
        monthly: 300,
        name: 'Three',
        overage: 0.3,
        volume: 3
      }
    ];

    const props = {
      input: { onChange: jest.fn() },
      plans
    };

    wrapper = shallow(<PlanPicker {...props} />);
  });
  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly with an initial value', () => {
    const selected = {
      code: '4',
      monthly: 400,
      name: 'Four',
      overage: 0.4,
      volume: 4
    };

    wrapper.setProps({ input: { onChange: jest.fn(), value: selected }});
    expect(wrapper).toMatchSnapshot();
  });
//
});
