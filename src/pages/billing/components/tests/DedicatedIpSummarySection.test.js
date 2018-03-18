import React from 'react';
import cases from 'jest-in-case';
import { shallow } from 'enzyme';

import DedicatedIpSummarySection from '../DedicatedIpSummarySection';

const TEST_CASES = {
  'renders upgrade button and zero count': {},
  'renders zero count and first is free notice': {
    count: 0,
    plan: { canPurchaseIps: true, includesIp: true },
    isAWSAccount: false
  },
  'renders count and zero cost': {
    count: 1,
    plan: { canPurchaseIps: true, includesIp: true },
    isAWSAccount: false
  },
  'renders disabled add button, count, cost, and max plan notice': {
    count: 4, // configuration default
    plan: { canPurchaseIps: true },
    isAWSAccount: false
  },
  'renders count and cost for aws customers': {
    count: 2,
    plan: {},
    isAWSAccount: true
  },
  'renders count and cost for aws customers with free ip': {
    count: 3,
    plan: { includesIp: true },
    isAWSAccount: true
  }
};

cases('DedicatedIpSummarySection', (props) => {
  const wrapper = shallow(<DedicatedIpSummarySection {...props} />);
  expect(wrapper).toMatchSnapshot();
}, TEST_CASES);
