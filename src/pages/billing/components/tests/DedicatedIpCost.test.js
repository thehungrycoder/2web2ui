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

  it('should render an AWS price', () => {
    const plan = {
      isAwsAccount: true
    };
    expect(shallow(<DedicatedIpCost quantity={2} plan={plan} />).text()).toEqual('$0.020 per hour');
  });

  it('should render a regular price', () => {
    const plan = {};
    expect(shallow(<DedicatedIpCost quantity={2} plan={plan} />).text()).toEqual('$40.00 per month');
  });

});
