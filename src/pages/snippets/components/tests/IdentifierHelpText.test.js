import React from 'react';
import { shallow } from 'enzyme';
import IdentifierHelpText from '../IdentifierHelpText';

describe('IdentifierHelpText', () => {
  it('renders message with link', () => {
    const wrapper = shallow(<IdentifierHelpText />);
    expect(wrapper).toMatchSnapshot();
  });
});
