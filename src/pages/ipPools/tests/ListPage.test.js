import { shallow } from 'enzyme';
import cases from 'jest-in-case';
import React from 'react';

import { IpPoolsList } from '../ListPage';

describe('IP Pools List Page', () => {
  it('should render the list page correctly', () => {
    const props = {
      loading: false,
      ipPools: [
        {name: 'Test Pool 1', id: 101, ips: [{external_ip: 1111}, {external_ip: 2222}]},
        {name: 'Test Pool 2', id: 102, ips: []}
      ],
      listPools: () => {}
    };
    const wrapper = shallow(<IpPoolsList {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should show alert upon error', () => {
    const props = {
      ipPools: [],
      listPools: () => {},
      error: {
        message: 'Uh oh! It broke.' // renders as details
      },
      loading: false
    }
    const wrapper = shallow(<IpPoolsList {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
