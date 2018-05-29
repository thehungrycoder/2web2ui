import React from 'react';
import { shallow } from 'enzyme';
import { SendMoreCTA } from '../SendMoreCTA';

describe('SendMoreCTA Component', () => {
  let props;
  let wrapper;
  let instance;

  beforeEach(() => {

    props = {
      verifyEmail: jest.fn(() => Promise.resolve()),
      showAlert: jest.fn(() => Promise.resolve()),
      openSupportTicketForm: jest.fn()
    };

    wrapper = shallow(<SendMoreCTA {...props} />);
    instance = wrapper.instance();
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('toggles support ticket form correctly', () => {
    wrapper.find('UnstyledLink').at(1).simulate('click');
    expect(props.openSupportTicketForm).toHaveBeenCalledWith({ issueId: 'daily_limits' });
  });

  describe('resendVerification', () => {
    it('renders verifying state', () => {
      wrapper.setProps({ verifyingEmail: true });
      expect(wrapper.find('span').text()).toEqual('Resending a verification email... ');
    });

    it('re-sends verification email and shows alert', async () => {
      await instance.resendVerification();
      expect(props.verifyEmail).toHaveBeenCalled();
      expect(props.showAlert).toHaveBeenCalled();
    });
  });
});
