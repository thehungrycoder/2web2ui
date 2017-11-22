import React from 'react';
import Animator from '../Animator';
import { shallow } from 'enzyme';

describe('Animator', () => {
  const props = {
    children: 'child',
    in: true
  };

  it('should render', () => {
    const wrapper = shallow(<Animator {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
