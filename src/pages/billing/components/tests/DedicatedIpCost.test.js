import React from 'react';
import { shallow } from 'enzyme';
import DedicatedIpCost from '../DedicatedIpCost';

jest.mock('src/config', () => ({
  sendingIps: {
    awsPricePerIp: 0.01,
    pricePerIp: 20
  }
}));

describe('Component: Dedicated IP Cost', () => {
  let wrapper;
  beforeEach(() => {
    const props = {
      quantity: 2,
      isAWSAccount: false
    };
    wrapper = shallow(<DedicatedIpCost {...props}/>);
  });
  it('should render an AWS price', () => {
    wrapper.setProps({ isAWSAccount: true });
    expect(wrapper.text()).toEqual('$0.020 per hour');
  });

  it('should render a regular price', () => {
    expect(wrapper.text()).toEqual('$40.00 per month');
  });

});
