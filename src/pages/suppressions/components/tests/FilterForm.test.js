import { shallow } from 'enzyme';
import React from 'react';

import { Results } from '../FilterForm';

let props;

let wrapper;

beforeEach(() => {
  props = {
    onSubmit: jest.fn(() => Promise.resolve())
  };

});

describe('FilterForm', () => {
  it('renders correctly', () => {
    wrapper = shallow(<Results {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

});
