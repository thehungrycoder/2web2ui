import React from 'react';
import cases from 'jest-in-case';
import { shallow } from 'enzyme';

import DedicatedIpCost from '../DedicatedIpCost';

const TEST_CASES = {
  'renders correct cost per ip for "normal" accounts': { quantity: 1 },
  'renders correct cost per ip for aws accounts': { quantity: 1, isAWSAccount: true }
};

cases('DedicatedIpCost', (props) => {
  const wrapper = shallow(<DedicatedIpCost {...props} />);
  expect(wrapper).toMatchSnapshot();
}, TEST_CASES);
