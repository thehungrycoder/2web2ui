import { shallow } from 'enzyme';
import React from 'react';

import { FilterForm } from '../FilterForm';

let props;

let wrapper;

beforeEach(() => {
  props = {
    onSubmit: jest.fn(() => Promise.resolve())
  };

});

describe('FilterForm', () => {
  it('renders correctly', () => {
    wrapper = shallow(<FilterForm {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

});
