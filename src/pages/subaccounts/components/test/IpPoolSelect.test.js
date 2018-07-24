import React from 'react';
import { shallow } from 'enzyme';

import IpPoolSelect from '../IpPoolSelect';

describe('IpPoolSelect', () => {
  const options = [
    { id: 'test', name: 'Test IP Pool' }
  ];

  it('renders with options', () => {
    const wrapper = shallow(<IpPoolSelect options={options} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders disabled', () => {
    const wrapper = shallow(<IpPoolSelect disabled={true} options={options} />);
    expect(wrapper).toMatchSnapshot();
  });
});
