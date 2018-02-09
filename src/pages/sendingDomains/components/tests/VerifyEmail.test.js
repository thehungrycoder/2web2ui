import React from 'react';
import { shallow } from 'enzyme';
import config from 'src/config';

import { VerifyEmail } from '../VerifyEmail';

describe('VerifyEmail component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      id: 'xyz.com',
      verifyAbuse: jest.fn(() => Promise.resolve()),
      verifyMailbox: jest.fn(() => Promise.resolve()),
      verifyPostmaster: jest.fn(() => Promise.resolve()),
      showAlert: jest.fn(),
      verifyEmailLoading: false,
      subaccount: 'submarine'
    };

    config.featureFlags.allow_anyone_at_verification = false;
    wrapper = shallow(<VerifyEmail {...props}/>);
  });

  it('should render with postmaster and abuse email verification', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with mailbox verification', () => {
    config.featureFlags.allow_anyone_at_verification = true;
    wrapper = shallow(<VerifyEmail {...props}/>);

    expect(wrapper).toMatchSnapshot();
  });

  it('should send abuse-at email', () => {
    wrapper.find('Button').at(1).simulate('click');
    expect(props.verifyAbuse).toHaveBeenCalledTimes(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('should send postmaster-at email', () => {
    wrapper.find('Button').at(0).simulate('click');
    expect(props.verifyPostmaster).toHaveBeenCalledTimes(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('should send custom mailbox email', () => {
    config.featureFlags.allow_anyone_at_verification = true;
    wrapper.setState({ localPart: 'krombopulos.michael' });

    wrapper.find('Button').at(0).simulate('click');
    expect(props.verifyMailbox).toHaveBeenCalledTimes(1);
    expect(props.verifyMailbox).toHaveBeenCalledWith({
      id: props.id,
      mailbox: 'krombopulos.michael',
      subaccount: props.subaccount
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('should error if custom mailbox field is invalid', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render error message', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render success message', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
