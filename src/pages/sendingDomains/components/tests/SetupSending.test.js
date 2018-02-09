import { shallow, mount } from 'enzyme';
import React from 'react';
import config from 'src/config';

import { SetupSending } from '../SetupSending';

describe('Component: SetupSending', () => {
  let wrapper;
  let props;
  let status;

  beforeEach(() => {
    jest.resetModules();

    status = {
      ownership_verified: false,
      dkim_status: null
    };
    props = {
      domain: {
        id: 'xyz.com',
        subaccount_id: 999,
        dkimHostname: 'scph0118._domainkey.xyz.com',
        dkimValue: 'v=DKIM1; k=rsa; h=sha256; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC7J/mQAVP9pynvD79opV/GD495pJWTWmHaEMymBO55y52gu2D23/CHbLys0KXszTAPOVS9x3HdRByeE1jIx41sZkWwDzxcyZH2NP5Mw3zNQWO4CqSGqrVPuukjIy5N3jmZnJ/V3IOkKnC3A+j76iIG42cVOgzoekbM3ZXSfwag+wIDAQAB',
        status
      },
      verifyDkimLoading: false,
      verifyDkim: jest.fn(() => Promise.resolve()),
      showAlert: jest.fn()
    };

    config.featureFlags.allow_mailbox_verification = true;
    wrapper = shallow(<SetupSending {...props}/>);
  });

  it('renders correctly for unverified DKIM and invalid ownership with mailbox verification enabled', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly when ownership and DKIM are verified', () => {
    const testProps = props.domain.status = { dkim_status: 'valid', ownership_verified: true };
    wrapper.setProps(testProps);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly for unverified DKIM and invalid ownership with mailbox verification disabled', () => {
    config.featureFlags.allow_mailbox_verification = false;
    const wrapper = shallow(<SetupSending {...props}/>);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly when ownership is valid and DKIM is unverified', () => {
    props.domain.status = { dkim_status: 'invalid', ownership_verified: true };
    wrapper.setProps(props);
    expect(wrapper).toMatchSnapshot();
  });

  it('disables the verification button while submitting', async() => {
    wrapper.setProps({ verifyDkimLoading: true });
    expect(wrapper.find('Panel').props().actions).toMatchSnapshot();
  });

  it('should call verifyDkim on click', () => {
    // Hiding modal which is component and needs a store to be passed to it
    config.featureFlags.allow_mailbox_verification = false;
    const wrapper = mount(<SetupSending {...props}/>);
    wrapper.find('button#verify-dkim').simulate('click');
    expect(props.verifyDkim).toHaveBeenCalledTimes(1);
  });

  describe('verifyDomain', () => {
    let instance;
    beforeEach(() => {
      instance = wrapper.instance();
    });

    it('verifies domain and alerts when verification successful', async() => {
      props.verifyDkim.mockReturnValue(Promise.resolve({ dkim_status: 'valid' }));
      await instance.verifyDomain();
      expect(props.verifyDkim).toHaveBeenCalledTimes(1);
      expect(props.verifyDkim).toHaveBeenCalledWith({ id: 'xyz.com', subaccount: 999 });
      expect(props.showAlert).toHaveBeenCalledTimes(1);
      expect(props.showAlert).toHaveBeenCalledWith({ type: 'success', message: 'You have successfully verified DKIM record of xyz.com' });
    });

    it('alerts error when verification req is successful but verification is failed', async() => {
      props.verifyDkim.mockReturnValue(Promise.resolve({ dkim_status: 'invalid', dns: { dkim_error: 'nope!' }}));
      await instance.verifyDomain();
      expect(props.verifyDkim).toHaveBeenCalledTimes(1);
      expect(props.verifyDkim).toHaveBeenCalledWith({ id: 'xyz.com', subaccount: 999 });
      expect(props.showAlert).toHaveBeenCalledTimes(1);
      expect(props.showAlert).toHaveBeenCalledWith({ type: 'error', message: 'Unable to verify DKIM record of xyz.com. nope!' });
    });

    it('alerts when request is errored', async() => {
      const err = new Error('Request failed!');
      props.verifyDkim.mockReturnValue(Promise.reject(err));
      await instance.verifyDomain();
      expect(props.verifyDkim).toHaveBeenCalledTimes(1);
      expect(props.verifyDkim).toHaveBeenCalledWith({ id: 'xyz.com', subaccount: 999 });
      expect(props.showAlert).toHaveBeenCalledTimes(1);
      expect(props.showAlert).toHaveBeenCalledWith({ type: 'error', message: 'Unable to verify DKIM record of xyz.com. Request failed!' });
    });

  });
});
