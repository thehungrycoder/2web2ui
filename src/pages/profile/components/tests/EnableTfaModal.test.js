import { shallow } from 'enzyme';
import React from 'react';
import EnableTfaModal from '../EnableTfaModal';
import _ from 'lodash';

describe('EnableTfaModal tests', () => {
  let wrapper;
  let instance;

  beforeEach(() => {
    const props = {
      enabled: true,
      open: true,
      toggleError: false,
      togglePending: false,
      secret: 'super-secret',
      username: 'kevin-mitnick',
      getSecret: jest.fn(),
      onClose: jest.fn(),
      enable: jest.fn()
    };

    wrapper = shallow(<EnableTfaModal {...props} />);
    instance = wrapper.instance();
    _.functions(instance).forEach((f) => jest.spyOn(instance, f));
    jest.spyOn(instance, 'setState');
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should show panel loading while retrieving 2fa deets', () => {
    wrapper.setProps({ secret: null });
    expect(wrapper).toMatchSnapshot();
  });

  it('should show verifying as button text when togglePending', () => {
    wrapper.setProps({ togglePending: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should show error on TextField when toggleError and showErrors', () => {
    wrapper.setState({ showErrors: true });
    wrapper.setProps({ toggleError: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle changes to passcode', () => {
    wrapper.find('TextField').simulate('change', { target: { value: 'pcode' }});
    expect(instance.setState).toHaveBeenCalledWith({ code: 'pcode' });
  });

  it('should call call enable on button click', () => {
    wrapper.setState({ code: 'pcode' });
    wrapper.find('Button').at(0).simulate('click');
    expect(instance.props.enable).toHaveBeenCalledWith('pcode');
  });

  it('should close on cancel', () => {
    wrapper.find('Button').at(1).simulate('click');
    expect(instance.props.onClose).toHaveBeenCalled();
  });

  describe('cDU tests', () => {
    // TODO: ask jason about this
    /*it('should close if not enabled and open', () => {
      expect(instance.props.onClose).toHaveBeenCalled();
    });*/

    it('should re-request secret on a modal toggle', () => {
      expect(instance.props.getSecret).not.toHaveBeenCalled();
      wrapper.setProps({ open: false });
      expect(instance.props.getSecret).not.toHaveBeenCalled();
      wrapper.setProps({ open: true });
      expect(instance.props.getSecret).toHaveBeenCalled();
    });

    it('should reset state if no longer open', () => {
      wrapper.setProps({ open: false });
      expect(instance.setState).toHaveBeenCalledWith({
        code: '',
        showErrors: false
      });
    });

    it('should set showErrors to true if toggleError is true', () => {
      wrapper.setProps({ toggleError: true });
      expect(instance.setState).toHaveBeenCalledWith({ showErrors: true });
    });

  });

});

