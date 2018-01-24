import React from 'react';
import { shallow } from 'enzyme';
import Typeahead from '../Typeahead';

jest.mock('src/helpers/sortMatch', () => ([]));

describe('Component: Typeahead', () => {
  it('should render ok by default', () => {
    const props = {
      items: [],
      onSelect: jest.fn(),
      placeholder: 'a placeholder'
    };
    const wrapper = shallow(<Typeahead {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
