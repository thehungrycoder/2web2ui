import { shallow } from 'enzyme';
import React from 'react';
import SettingsFields from '../SettingsFields';

describe('Settings Fields Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      diabled: false,
      formValues: {
        test_mode: 'bayesian',
        audience_selection: 'sample_size'
      }
    };
    wrapper = shallow(<SettingsFields {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should disable fields correctly', () => {
    wrapper.setProps({ disabled: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render confidence level if in bayesian mode', () => {
    expect(wrapper.find({ name: 'confidence_level' })).toExist();
    wrapper.setProps({ formValues: { ...props.formValues, test_mode: 'learning' }});
    expect(wrapper.find({ name: 'confidence_level' })).not.toExist();
  });

  it('should not render sample size if in using percent', () => {
    expect(wrapper.find({ name: 'total_sample_size' })).toExist();
    wrapper.setProps({ formValues: { ...props.formValues, audience_selection: 'percent' }});
    expect(wrapper.find({ name: 'total_sample_size' })).not.toExist();
  });
});
