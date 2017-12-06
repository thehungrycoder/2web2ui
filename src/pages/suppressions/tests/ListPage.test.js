import { shallow } from 'enzyme';
import React from 'react';

import { ListPage } from '../ListPage';

let props;

let wrapper;

beforeEach(() => {
  props = {
  };
  wrapper = shallow(<ListPage {...props} />);
});

describe('ListPage', () => {
  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
