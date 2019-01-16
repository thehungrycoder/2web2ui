import { shallow } from 'enzyme';
import React from 'react';
import cases from 'jest-in-case';
import EngagementRecencyActions from '../EngagementRecencyActions';

describe('Signals engagement recency actions component', () => {
  let wrapper;

  cases('render cases', (cohorts) => {
    const wrapper = shallow(<EngagementRecencyActions cohorts={cohorts} />);
    expect(wrapper.prop('actions')).toMatchSnapshot();
  }, {
    'should render unengaged bad value': {
      c_uneng: 0.25
    },
    'should render unengaged warning value': {
      c_uneng: 0.1
    },
    'should render new bad value': {
      c_new: 0.25
    },
    'should render new warning value': {
      c_new: 0.15
    },
    'should render 365 day bad value': {
      c_365d: 0.3
    },
    'should render 365 day warning value': {
      c_365d: 0.15
    },
    // 'should render 90 day bad value': {
    //   c_90d: 0.15
    // },
    // 'should render 90 day warning value': {
    //   c_90d: 0.30
    // },
    'should render 14 day bad value': {
      c_14d: 0.15
    },
    'should render 14 day warning value': {
      c_14d: 0.30
    },
    'should render only 3 items': {
      c_14d: 0.30,
      c_new: 0.25,
      c_uneng: 0.15,
      c_90: 0.15
    }
  });

  it('renders empty', () => {
    wrapper = shallow(<EngagementRecencyActions cohorts={{ c_total: null }} />);
    expect(wrapper.prop('empty')).toBe(true);
  });
});
