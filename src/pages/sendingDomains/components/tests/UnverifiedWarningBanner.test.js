import { shallow } from 'enzyme';
import React from 'react';

import UnverifiedWarningBanner from '../UnverifiedWarningBanner';

describe('Component: Unverified Domain Warning Banner', () => {
  it('renders correctly', () => {
    expect(shallow(<UnverifiedWarningBanner/>)).toMatchSnapshot();
  });
});
