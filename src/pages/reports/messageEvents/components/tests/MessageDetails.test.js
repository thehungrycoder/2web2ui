import React from 'react';
import { shallow } from 'enzyme';
import MessageDetails from '../MessageDetails';

describe('MessageDetails Component', () => {

  it('should render with no props', () => {
    const wrapper = shallow(<MessageDetails />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with all props', () => {
    const props = {
      details: {
        key1: 'val1',
        key2: ['an', 'arrray'],
        type: 'bounce'
      },
      documentation: {
        bounce: {
          key1: 'description for key1'
        }
      }
    };

    const wrapper = shallow(<MessageDetails {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
