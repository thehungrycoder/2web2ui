import React from 'react';
import { shallow } from 'enzyme';
import { EnableTfaForm } from '../EnableTfaForm';

describe('Component: EnableTfaForm', () => {
  const baseProps = {
    enabled: true,
    toggleError: false,
    togglePending: false,
    secret: 'super-secret',
    username: 'kevin-mitnick'
  };

  function subject(props) {
    const actions = {
      getTfaSecret: jest.fn(),
      toggleTfa: jest.fn().mockResolvedValue(),
      showAlert: jest.fn(),
      afterEnable: jest.fn(),
      onClose: jest.fn()
    };
    return shallow(<EnableTfaForm {...baseProps} {...actions} {...props} />);
  }

  it('should request tfa secret on mount', () => {
    expect(subject().instance().props.getTfaSecret).toHaveBeenCalledTimes(1);
  });

  it('should show panel loading while retrieving 2fa deets', () => {
    expect(subject({ secret: null }).find('PanelLoading').exists()).toBeTruthy();
  });

  it('should show form after loading', () => {
    expect(subject({ secret: 'sauce' })).toMatchSnapshot();
  });

  it('should handle changes to passcode', () => {
    const wrapper = subject();
    wrapper.find('TextField').simulate('change', { target: { value: 'pcode' }});
    expect(wrapper.state('code')).toEqual('pcode');
  });

  it('should call toggleTfa on button click', () => {
    const wrapper = subject();
    wrapper.setState({ code: 'pcode' });
    wrapper.find('Button[type="submit"]').first().simulate('click');
    expect(wrapper.instance().props.toggleTfa).toHaveBeenCalledWith({
      code: 'pcode',
      enabled: true
    });
  });

  it('should show verifying as button text when togglePending', () => {
    expect(subject({ togglePending: true }).find('Button[type="submit"]').children().text()).toContain('Verifying');
  });

  it('should show error on TextField when toggleError', () => {
    const wrapper = subject({ toggleError: true });
    expect(wrapper.find('TextField').prop('error').length).toBeGreaterThan(0);
  });

  it('should show alert after toggling', () => {
    const wrapper = subject({ togglePending: true });
    wrapper.setProps({ togglePending: false });
    wrapper.update();
    expect(wrapper.instance().props.showAlert).toHaveBeenCalledTimes(1);
  });

  it('should call afterEnable after toggling', () => {
    const wrapper = subject({ togglePending: true });
    wrapper.setProps({ togglePending: false });
    wrapper.update();
    expect(wrapper.instance().props.afterEnable).toHaveBeenCalledTimes(1);
  });

  it('should not show cancel button if onClose prop not set', () => {
    expect(subject({ onClose: null }).find('Button')).toHaveLength(1);
  });

  it('should show cancel button if onClose prop set', () => {
    expect(subject().find('Button')).toHaveLength(2);
  });

  it('should close on cancel', () => {
    const wrapper = subject();
    wrapper.find('Button').at(1).simulate('click');
    expect(wrapper.instance().props.onClose).toHaveBeenCalled();
  });
});
