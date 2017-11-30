import React from 'react';
import cases from 'jest-in-case';
import { shallow } from 'enzyme';

import DedicatedIpSummarySection from '../DedicatedIpSummarySection';

const TEST_CASES = {
  'renders upgrade button and zero count': {},
  'renders zero count and first is free notice': {
    count: 0,
    plan: { canPurchaseIps: true, includesIp: true }
  },
  'renders count and zero cost': {
    count: 1,
    plan: { canPurchaseIps: true, includesIp: true }
  },
  'renders disabled add button, count, cost, and max plan notice': {
    count: 4, // configuration default
    plan: { canPurchaseIps: true }
  }
};

cases('DedicatedIpSummarySection', props => {
  const wrapper = shallow(<DedicatedIpSummarySection {...props} />);
  expect(wrapper).toMatchSnapshot();
}, TEST_CASES);
