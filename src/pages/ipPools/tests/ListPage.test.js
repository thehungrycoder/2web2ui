import { shallow } from 'enzyme';
import React from 'react';

import { IpPoolsList, getRowData } from '../ListPage';
import { renderRowData } from 'src/__testHelpers__/renderHelpers';

describe('IP Pools List Page', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      loading: false,
      ipPools: [
        { name: 'Test Pool 1', id: 101, ips: [{ external_ip: 1111 }, { external_ip: 2222 }]},
        { name: 'Test Pool 2', id: 102, ips: []}
      ],
      listPools: jest.fn(() => [])
    };

    wrapper = shallow(<IpPoolsList {...props} />);
  });

  it('should render the list page correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should show alert upon error', () => {
    wrapper.setProps({ ipPools: [], error: { message: 'Uh oh! It broke.' }});
    expect(wrapper).toMatchSnapshot();
  });

  it('should render loading component when loading data', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render row properly', () => {
    const rows = getRowData({
      id: 'my-pool',
      name: 'My Pool',
      ips: [1,2,3]
    });

    expect(renderRowData(rows)).toMatchSnapshot();
  });
});
