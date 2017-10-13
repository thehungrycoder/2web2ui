import React from 'react';
import cases from 'jest-in-case';
import _ from 'lodash';
import { shallow } from 'enzyme';

import { UsageReport } from '../UsageReport';

import datefns from 'date-fns';

// Overrides format function - prevents tests from failing when run in different timezones.
datefns.format = jest.fn((date) => date);

describe('UsageReport Component', () => {


  const props = {
    subscription: {
      plan_volume: 10000
    },
    usage: {
      month: {
        used: 1000,
        limit: 50000,
        start: '2017-08-01T08:00:00.000Z',
        end: '2017-08-31T08:00:00.000Z'
      },
      day: {
        used: 1000,
        limit: 2000,
        start: '2017-08-30T00:00:00.000Z'
      }
    }
  };

  const nullRenderCases = [
    { name: 'no props' },
    { name: 'only subscription', props: { subscription: {}}},
    { name: 'only usage', props: { usage: {}}}
  ];

  cases('render null:', (opts) => {
    const wrapper = shallow(<UsageReport {...opts.props}/>);
    expect(wrapper).toMatchSnapshot();
  }, nullRenderCases);

  it('should render with regular usage', () => {
    const wrapper = shallow(<UsageReport {...props}/>);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render with overages', () => {
    const ovarageProps = _.cloneDeep(props);
    ovarageProps.usage.month.used = props.subscription.plan_volume + 1000;
    const wrapper = shallow(<UsageReport {...ovarageProps}/>);

    expect(wrapper).toMatchSnapshot();
  });

});
