import React from 'react';
import { shallow } from 'enzyme';
import PlanSummary from '../PlanSummary';

describe('PlanSummary', () => {
  const subject = (plan = {}) => shallow(
    <PlanSummary plan={{ plan_volume: 1000, recurring_charge: 100, ...plan }} />
  );

  it('renders summary', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('renders summary for free plan', () => {
    expect(subject({ recurring_charge: 0 })).toMatchSnapshot();
  });

  it('renders summary with overages', () => {
    expect(subject({ overage: 0.0123 })).toMatchSnapshot();
  });

  it('renders summary with custom plan', () => {
    const plan = {
      plan_volume: 1000,
      plan_volume_per_period: 12000,
      recurring_charge: 100,
      period: 'year'
    };

    expect(subject(plan)).toMatchSnapshot();
  });
});
