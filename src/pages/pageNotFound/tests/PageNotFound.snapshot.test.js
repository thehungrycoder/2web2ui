import { shallow } from 'enzyme';
import React from 'react';

import { PageNotFound } from '../index';

describe('Page: Page Not Found tests', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<PageNotFound/>);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
