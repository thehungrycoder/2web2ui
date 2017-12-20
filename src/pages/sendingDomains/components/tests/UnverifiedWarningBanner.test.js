import { shallow } from 'enzyme';
import React from 'react';

import UnverifiedWarningBanner from '../UnverifiedWarningBanner';

describe('Unverified Domain Warning Banner', () => {
  it('renders correctly', () => {
    expect(shallow(<UnverifiedWarningBanner/>)).toMatchSnapshot();
  })
});
