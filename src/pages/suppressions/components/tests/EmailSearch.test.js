import { shallow } from 'enzyme';
import React from 'react';

import { FilterForm } from '../EmailSearch';

let props;

let wrapper;

beforeEach(() => {
  props = {
  };

});

describe('EmailSearch', () => {
  it('renders correctly', () => {
    wrapper = shallow(<FilterForm {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly with subaccounts', () => {
    props.hasSubaccounts = true;
    wrapper = shallow(<FilterForm {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

});
