import { shallow } from 'enzyme';
import React from 'react';
import SettingsContent from '../SettingsContent';

describe('Settings Content Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      test: {}
    };
    wrapper = shallow(<SettingsContent {...props} />);
  });

  it('should not render anything by default', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when test is in draft mode', () => {
    wrapper.setProps({ test: { status: 'draft' }});
    expect(wrapper).toMatchSnapshot();
  });
});
