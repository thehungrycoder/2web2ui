import { shallow } from 'enzyme';
import React from 'react';
import BackupCodesModal from '../BackupCodesModal';
import _ from 'lodash';

describe('Component: BackupCodesModal', () => {
  let wrapper;
  let instance;

  beforeEach(() => {
    const props = {
      codes: [],
      open: true,
      activeCount: 10,
      error: null,
      generate: jest.fn(),
      pending: false,
      onClose: jest.fn()
    };

    wrapper = shallow(<BackupCodesModal {...props} />);
    instance = wrapper.instance();
    _.functions(instance).forEach((f) => jest.spyOn(instance, f));
    jest.spyOn(instance, 'setState');

  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should show new codes when they exist', () => {
    wrapper.setProps({ codes: [1,2,3,4]});
    expect(wrapper).toMatchSnapshot();
  });

  it('should show password error when exists', () => {
    wrapper.setProps({ error: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should change button text to Generating... when submitting', () => {
    wrapper.setProps({ pending: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should call generate when generateCodes is called', () => {
    wrapper.setState({ password: 'Password1' });
    instance.generateCodes();
    expect(instance.props.generate).toHaveBeenCalledWith('Password1');
  });

  it('should handles changes to password', () => {
    wrapper.find('TextField').simulate('change', { target: { value: 'pass' }});
    expect(instance.setState).toHaveBeenCalledWith({ password: 'pass' });

  });

  describe('componentDidUpdate tests', () => {
    it('should reset state to initial when the modal closes', () => {
      wrapper.setProps({ open: false });
      expect(instance.setState).toHaveBeenCalledWith({
        password: '',
        showErrors: false
      });
    });

    it('should set showErrors on state when there is an error', () => {
      wrapper.setProps({ error: true });
      expect(instance.setState).toHaveBeenCalledWith({ showErrors: true });
    });

  });

});

