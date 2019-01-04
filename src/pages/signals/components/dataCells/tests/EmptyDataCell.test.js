import React from 'react';
import { shallow } from 'enzyme';
import EmptyDataCell from '../EmptyDataCell';

describe('EmptyDataCell', () => {
  it('renders message', () => {
    const wrapper = shallow(<EmptyDataCell />);
    expect(wrapper).toMatchSnapshot();
  });
});
