import { shallow } from 'enzyme';
import React from 'react';
import SettingsView from '../SettingsView';
import { Panel } from '@sparkpost/matchbox';

describe('Settings View Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      test: {
        test_mode: 'bayesian',
        confidence_level: 0.55,
        metric: 'count_unique_clicked',
        engagement_timeout: 14,
        total_sample_size: 100,
        audience_selection: 'sample_size'
      }
    };
    wrapper = shallow(<SettingsView {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render learning mode correctly', () => {
    wrapper.setProps({ test: { ...props.test, test_mode: 'learning' }});
    expect(wrapper.find(Panel.Section).first()).toMatchSnapshot();
  });
});
