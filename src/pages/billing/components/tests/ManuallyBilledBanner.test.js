import React from 'react';
import { shallow } from 'enzyme';
import ManuallyBilledBanner from '../ManuallyBilledBanner';

describe('ManuallyBilledBanner', () => {
  const subject = ({ account = {}}) => (
    shallow(<ManuallyBilledBanner account={account} />)
  );

  it('renders banner', () => {
    const account = {
      subscription: {
        name: 'Test',
        plan_volume: 15000
      }
    };

    expect(subject({ account })).toMatchSnapshot();
  });

  it('with transitioning custom subscription', () => {
    const account = {
      subscription: {
        custom: true,
        name: 'Custom',
        plan_volume: 15000,
        plan_volume_per_period: undefined
      }
    };

    expect(subject({ account })).toMatchSnapshot();
  });

  it('with custom subscription', () => {
    const account = {
      subscription: {
        custom: true,
        name: 'Custom',
        period: 'year',
        plan_volume: 10000,
        plan_volume_per_period: 120000
      }
    };

    expect(subject({ account })).toMatchSnapshot();
  });
});
