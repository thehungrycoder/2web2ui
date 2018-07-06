import { shallow } from 'enzyme';
import React from 'react';

import { IpPoolsList, getRowData } from '../ListPage';

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
      listPools: jest.fn(() => []),
      showPurchaseCTA: true
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

    expect(rows).toMatchSnapshot();
  });

  it('does not render purchase action if showPurchaseCTA is false', () => {
    wrapper.setProps({ ipPools: [{ name: 'Default', ips: []}], showPurchaseCTA: false });
    expect(wrapper).toMatchSnapshot();
  });
});
