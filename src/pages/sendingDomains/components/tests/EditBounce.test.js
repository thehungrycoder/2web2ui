import { shallow } from 'enzyme';
import React from 'react';
import { EditBounce } from '../EditBounce';
import config from 'src/config';

jest.mock('src/config', () => ({
  zuora: {}, //axiosInstance throws without this
  authentication: { cookie: {}}, //authCookie throws without this
  bounceDomains: {
    allowDefault: false,
    cnameValue: 'sparkpostmail.com'
  }
}));

let instance;

describe('Component: EditBounce', () => {
  let wrapper;
  let props;
  let status;
  beforeEach(() => {
    status = {
      ownership_verified: null,
      cname_status: null,
      dkim_status: null,
      mx_status: null
    };
    props = {
      id: 'xyz.com',
      domain: {
        status,
        is_default_bounce_domain: false,
        subaccount_id: 100
      },
      verify: jest.fn(() => Promise.resolve()),
      update: jest.fn(() => Promise.resolve()),
      showAlert: jest.fn(),
      reset: jest.fn()
    };

    wrapper = shallow(<EditBounce {...props}/>);

    instance = wrapper.instance();
  });

  it('renders ready correctly', () => {
    wrapper.setProps({ domain: { status: { ...status, cname_status: 'valid' }}});
    expect(wrapper).toMatchSnapshot();
  });

  it('renders not ready correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('does not show root domain warning for 3rd level domain', () => {
    wrapper.setProps({ id: 'c.b.a.com' });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly when allowDefault is true', () => {
    config.bounceDomains.allowDefault = true;
    wrapper.setProps({ domain: { status: { ...status, cname_status: 'valid' }}});
    expect(wrapper).toMatchSnapshot();
  });

  describe('verifyDomain', () => {
    it('verifies domain and alerts when verification successful', async() => {
      props.verify.mockReturnValue(Promise.resolve({ cname_status: 'valid' }));
      await instance.verifyDomain();
      expect(props.verify).toHaveBeenCalledTimes(1);
      expect(props.verify).toHaveBeenCalledWith('xyz.com', 'cname', 100);
      const arg = props.showAlert.mock.calls[0][0];
      expect(props.showAlert).toHaveBeenCalledTimes(1);
      expect(arg.type).toEqual('success');
      expect(arg.message).toMatch(/successfully verified/);
    });

    it('alerts error when verification req is successful but verification is failed', async() => {
      props.verify.mockReturnValue(Promise.resolve({ cname_status: 'invalid' }));
      await instance.verifyDomain();
      expect(props.verify).toHaveBeenCalledTimes(1);
      expect(props.verify).toHaveBeenCalledWith('xyz.com', 'cname', 100);
      const arg = props.showAlert.mock.calls[0][0];
      expect(props.showAlert).toHaveBeenCalledTimes(1);
      expect(arg.type).toEqual('error');
      expect(arg.message).toMatch(/Unable to verify CNAME/);
    });

    it('alerts when request is errored', async() => {
      const err = new Error('Request failed!');
      props.verify.mockReturnValue(Promise.reject(err));
      await instance.verifyDomain();
      expect(props.verify).toHaveBeenCalledTimes(1);
      expect(props.verify).toHaveBeenCalledWith('xyz.com', 'cname', 100);
      const arg = props.showAlert.mock.calls[0][0];
      expect(props.showAlert).toHaveBeenCalledTimes(1);
      expect(arg.type).toEqual('error');
      expect(arg.message).toMatch(/Request failed/);
    });
  });

  describe('toggleDefaultBounce', () => {
    it('calls update with toggled value', async() => {
      await instance.toggleDefaultBounce();
      expect(props.update).toHaveBeenCalledWith(props.id, { is_default_bounce_domain: true }, 100);

      props.domain.is_default_bounce_domain = true;
      await instance.toggleDefaultBounce();
      expect(props.update).toHaveBeenCalledWith(props.id, { is_default_bounce_domain: false }, 100);
    });

    it('alerts on error and reset form', async() => {
      const err = new Error('Request failed!');
      props.update.mockReturnValue(Promise.reject(err));

      await instance.toggleDefaultBounce();
      expect(props.update).toHaveBeenCalledTimes(1);
      expect(props.update).toHaveBeenCalledWith(props.id, { is_default_bounce_domain: true }, 100);
      expect(props.showAlert).toHaveBeenCalledTimes(1);
      expect(props.showAlert.mock.calls[0][0].type).toEqual('error');
      expect(props.reset).toHaveBeenCalledTimes(1);
    });
  });
});
