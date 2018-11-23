import React from 'react';
import { shallow } from 'enzyme';
import StatusSection from '../StatusSection';

describe('StatusSection', () => {
  const subject = (props = {}) => {
    const baseProps = {
      provider: 'https://sso.sparkpost.com/redirect',
      readOnly: false
    };
    return shallow(<StatusSection {...baseProps} {...props} />);
  };

  it('renders nothing when not provisioned', () => {
    const wrapper = subject({ provider: null });
    expect(wrapper.html()).toBeNull();
  });

  it('renders when enabled', () => {
    const wrapper = subject({ enabled: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders when disabled', () => {
    const wrapper = subject({ enabled: false });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders when readOnly', () => {
    const wrapper = subject({ readOnly: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('enables SSO when enable button is clicked', () => {
    const updateAccountSingleSignOn = jest.fn();
    const wrapper = subject({
      cert: 'abc==',
      enabled: false,
      provider: 'https://sso.sparkpost.com/redirect',
      updateAccountSingleSignOn
    });

    wrapper.prop('actions')[0].onClick();

    expect(updateAccountSingleSignOn).toHaveBeenCalledWith({
      cert: 'abc==',
      enabled: true,
      provider: 'https://sso.sparkpost.com/redirect'
    });
  });

  it('opens modal when disable button is clicked', () => {
    const wrapper = subject({ enabled: true });
    wrapper.prop('actions')[0].onClick();
    expect(wrapper.state('isModalOpen')).toEqual(true);
  });

  it('disables SSO when disable confirmation button is clicked', () => {
    const updateAccountSingleSignOn = jest.fn();
    const wrapper = subject({
      cert: 'abc==',
      enabled: true,
      provider: 'https://sso.sparkpost.com/redirect',
      updateAccountSingleSignOn
    });

    wrapper.find('ConfirmationModal').simulate('confirm');

    expect(updateAccountSingleSignOn).toHaveBeenCalledWith({
      cert: 'abc==',
      enabled: false,
      provider: 'https://sso.sparkpost.com/redirect'
    });
  });

  it('closes modal when cancel button is clicked', () => {
    const wrapper = subject({ enabled: true });

    wrapper.setState({ isModalOpen: true });
    wrapper.find('ConfirmationModal').simulate('cancel');

    expect(wrapper.state('isModalOpen')).toEqual(false);
  });

  it('closes modal when updated', () => {
    const wrapper = subject();

    wrapper.setState({ isModalOpen: true });
    wrapper.setProps({ updatedAt: '2018-09-11T21:17:50+00:00' });

    expect(wrapper.state('isModalOpen')).toEqual(false);
  });

  it('disables buttons when updating', () => {
    const wrapper = subject({ updating: true });
    expect(wrapper).toMatchSnapshot();
  });
});
