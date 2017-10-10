import React from 'react';
import { shallow } from 'enzyme';

import TrackingDomainsListHeader from '../TrackingDomainsListHeader';

it('should render', () => {
  const wrapper = shallow(<TrackingDomainsListHeader />);
  expect(wrapper).toMatchSnapshot();
});
