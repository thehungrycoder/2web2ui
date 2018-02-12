import React from 'react';
import { shallow } from 'enzyme';
import Note from '../Note';

it('renders a note', () => {
  const wrapper = shallow(<Note>Attention!</Note>);
  expect(wrapper).toMatchSnapshot();
});
