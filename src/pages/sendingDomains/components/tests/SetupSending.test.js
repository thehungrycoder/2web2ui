import { shallow } from 'enzyme';
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
      id: 'xyz.com',
      domain: {
        dkim: {
          selector: 'scph0118',
          public: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC7J/mQAVP9pynvD79opV/GD495pJWTWmHaEMymBO55y52gu2D23/CHbLys0KXszTAPOVS9x3HdRByeE1jIx41sZkWwDzxcyZH2NP5Mw3zNQWO4CqSGqrVPuukjIy5N3jmZnJ/V3IOkKnC3A+j76iIG42cVOgzoekbM3ZXSfwag+wIDAQAB'
        },
        status
      },
      verify: jest.fn(() => Promise.resolve()),
      showAlert: jest.fn()
    };

    config.featureFlags.allow_mailbox_verification = true;
    wrapper = shallow(<SetupSending {...props}/>);
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

  it('renders correctly for unverified DKIM and invalid ownership with mailbox verification enabled', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly when ownership is valid and DKIM is unverified', () => {
    props.domain.status = { dkim_status: 'invalid', ownership_verified: true };
    wrapper.setProps(props);
    expect(wrapper).toMatchSnapshot();
  });

  describe('verifyDomain', () => {
    let instance;
    beforeEach(() => {
      instance = wrapper.instance();
    });

    it('verifies domain and alerts when verification successful', async() => {
      props.verify.mockReturnValue(Promise.resolve({ dkim_status: 'valid' }));
      await instance.verifyDomain();
      expect(props.verify).toHaveBeenCalledTimes(1);
      expect(props.verify).toHaveBeenCalledWith('xyz.com', 'dkim');
      const arg = props.showAlert.mock.calls[0][0];
      expect(props.showAlert).toHaveBeenCalledTimes(1);
      expect(arg.type).toEqual('success');
      expect(arg.message).toMatch(/successfully verified/);
    });

    it('alerts error when verification req is successful but verification is failed', async() => {
      props.verify.mockReturnValue(Promise.resolve({ dkim_status: 'invalid' }));
      await instance.verifyDomain();
      expect(props.verify).toHaveBeenCalledTimes(1);
      expect(props.verify).toHaveBeenCalledWith('xyz.com', 'dkim');
      const arg = props.showAlert.mock.calls[0][0];
      expect(props.showAlert).toHaveBeenCalledTimes(1);
      expect(arg.type).toEqual('error');
      expect(arg.message).toMatch(/Unable to verify DKIM/);
    });

    it('alerts when request is errored', async() => {
      const err = new Error('Request failed!');
      props.verify.mockReturnValue(Promise.reject(err));
      await instance.verifyDomain();
      expect(props.verify).toHaveBeenCalledTimes(1);
      expect(props.verify).toHaveBeenCalledWith('xyz.com', 'dkim');
      const arg = props.showAlert.mock.calls[0][0];
      expect(props.showAlert).toHaveBeenCalledTimes(1);
      expect(arg.type).toEqual('error');
      expect(arg.message).toMatch(/Request failed/);
    });

  });
});
