import { shallow } from 'enzyme';
import React from 'react';

import PermissionsColumn from '../PermissionsColumn';

const props = {
  label: 'Test Key 1',
  short_key: 'ab01',
  grants: ['account/view', 'metrics/view', 'suppresions/view']
};

let wrapper;

beforeEach(() => {
  wrapper = shallow(<PermissionsColumn {...props} />);
});

it('renders correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

it('renders correctly with no grants', () => {
  wrapper.setProps({ grants: []});
  expect(wrapper).toMatchSnapshot();
});
