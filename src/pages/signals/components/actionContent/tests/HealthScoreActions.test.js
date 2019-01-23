import { shallow } from 'enzyme';
import React from 'react';
import HealthScoreActions from '../HealthScoreActions';
import cases from 'jest-in-case';

describe('Signals health score actions', () => {

  it('renders when empty', () => {
    let wrapper;
    wrapper = shallow(<HealthScoreActions weights={[]} />);
    expect(wrapper.find('Actions').prop('empty')).toBe(true);
  });

  cases('render cases', (props) => {
    const wrapper = shallow(<HealthScoreActions {...props} />);
    expect(wrapper.prop('actions')).toMatchSnapshot();
  }, {
    'should render list quality action': {
      weights: [{ weight_type: 'List Quality', weight: -0.1 }]
    },
    'should render hard bounce action': {
      weights: [{ weight_type: 'Hard Bounces', weight: -0.1 }]
    },
    'should render block bounces action': {
      weights: [{ weight_type: 'Block Bounces', weight: -0.1 }]
    },
    'should render compaints action': {
      weights: [{ weight_type: 'Complaints', weight: -0.1 }]
    },
    'should render transient failures action': {
      weights: [{ weight_type: 'Transient Failures', weight: -0.1 }]
    },
    'should render other bounces action': {
      weights: [{ weight_type: 'Other bounces', weight: -0.1 }]
    },
    'should render unengaged action': {
      weights: [{ weight_type: 'eng cohorts: unengaged', weight: -0.1 }]
    },
    'should render engaged action': {
      weights: [{ weight_type: 'eng cohorts: new, 14-day', weight: -0.1 }]
    },
    'ignores unsupported components': {
      weights: [{ weight_type: 'a new comp', weight: -0.1 }]
    },
    'sorts by weight and only displays first 2': {
      weights: [
        { weight_type: 'Hard Bounces', weight: '-0.3' },
        { weight_type: 'List Quality', weight: '-0.1' },
        { weight_type: 'Block Bounces', weight: '-0.5' }
      ]
    },
    'renders an action correctly only when negative': {
      weights: [
        { weight_type: 'List Quality', weight: '0.001' }
      ]
    }
  });
});
