import React from 'react';
import ActiveLabel from '../ActiveLabel';
import { shallow } from 'enzyme';

describe('ActiveLabel: ', () => {
  it('should render', () => {
    const props = {
      name: 'name',
      value: '123'
    }
    const wrapper = shallow(<ActiveLabel {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
