import { shallow } from 'enzyme';
import React from 'react';

import SkipLink from '../SkipLink';

describe('SkipLink', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<SkipLink to='/a-path'>go to a path</SkipLink>);
    expect(wrapper).toMatchSnapshot();
  });
});
