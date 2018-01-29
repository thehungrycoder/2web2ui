import { shallow } from 'enzyme';
import React from 'react';

import PageNotFound from '../PageNotFound';

describe('Page: Page Not Found tests', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<PageNotFound/>);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
