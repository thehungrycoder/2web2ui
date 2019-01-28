import React from 'react';
import { shallow } from 'enzyme';
import WoWHeaderCell from '../WoWHeaderCell';

describe('WoWHeaderCell', () => {
  it('renders', () => {
    expect(shallow(<WoWHeaderCell />)).toMatchSnapshot();
  });
});
