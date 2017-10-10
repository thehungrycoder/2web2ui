import React from 'react';
import { shallow } from 'enzyme';

import TrackingDomainsEmptyState from '../TrackingDomainsEmptyState';

it('should render', () => {
  const wrapper = shallow(<TrackingDomainsEmptyState />);
  expect(wrapper).toMatchSnapshot();
});
