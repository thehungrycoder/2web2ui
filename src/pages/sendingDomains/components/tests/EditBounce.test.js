import { shallow } from 'enzyme';
import React from 'react';
import { EditBounce } from '../EditBounce';
import config from 'src/config';

jest.mock('src/config', () => ({
  zuora: {}, //axiosInstance throws without this
  authentication: { cookie: {}}, //authCookie throws without this,
  heroku: {
    cookieName: 'my-cookie'
  },
  website: {
    domain: ''
  },
  support: { algolia: {}},
  cookieConsent: { cookie: {}},
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
      verifyCname: jest.fn(() => Promise.resolve()),
      update: jest.fn(() => Promise.resolve()),
      showAlert: jest.fn(),
      reset: jest.fn(),
      verifyCnameLoading: false
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

  describe('default bounce toggle', () => {
    it('renders correctly toggle when all conditions are true', () => {
      config.bounceDomains.allowDefault = true;
      wrapper.setProps({ domain: { status: { ...status, ownership_verified: true, cname_status: 'valid' }}});
      expect(wrapper.find('Field')).toMatchSnapshot();
    });

    it('does not render if config is false', () => {
      config.bounceDomains.allowDefault = false;
      wrapper.setProps({ domain: { status: { ...status, ownership_verified: true, cname_status: 'valid' }}});
      expect(wrapper.find('Field')).toHaveLength(0);
    });

    it('does not render if not ownership verified', () => {
      config.bounceDomains.allowDefault = true;
      wrapper.setProps({ domain: { status: { ...status, ownership_verified: false, cname_status: 'valid' }}});
      expect(wrapper.find('Field')).toHaveLength(0);
    });

    it('does not render if assigned to subaccount', () => {
      config.bounceDomains.allowDefault = true;
      wrapper.setProps({ domain: { subaccount_id: 101, status: { ...status, ownership_verified: true, cname_status: 'valid' }}});
      expect(wrapper.find('Field')).toHaveLength(0);
    });

    it('does not render if not ready for bounce', () => {
      config.bounceDomains.allowDefault = true;
      wrapper.setProps({ domain: { status: { ...status, ownership_verified: true, cname_status: 'invalid' }}});
      expect(wrapper.find('Field')).toHaveLength(0);
    });
  });


  describe('verifyDomain', () => {
    it('renders loading state correctly', async() => {
      wrapper.setProps({ verifyCnameLoading: true });
      expect(wrapper.find('Panel').props().actions).toMatchSnapshot();
    });

    it('verifies domain and alerts when verification successful', async() => {
      props.verifyCname.mockReturnValue(Promise.resolve({ cname_status: 'valid' }));
      await instance.verifyDomain();
      expect(props.verifyCname).toHaveBeenCalledTimes(1);
      expect(props.verifyCname).toHaveBeenCalledWith({ id: 'xyz.com', subaccount: 100 });
      const arg = props.showAlert.mock.calls[0][0];
      expect(props.showAlert).toHaveBeenCalledTimes(1);
      expect(arg.type).toEqual('success');
      expect(arg.message).toMatch(/successfully verified/);
    });

    it('alerts error when verification req is successful but verification is failed', async() => {
      const result = {
        cname_status: 'invalid',
        dns: {
          cname_error: 'Something horrible just happened!'
        }
      };

      props.verifyCname.mockReturnValue(Promise.resolve(result));
      await instance.verifyDomain();

      expect(props.verifyCname).toHaveBeenCalledWith({ id: 'xyz.com', subaccount: 100 });
      expect(props.showAlert).toHaveBeenCalledWith({
        type: 'error',
        message: expect.stringContaining(result.dns.cname_error)
      });
    });
  });

  describe('toggleDefaultBounce', () => {
    it('calls update with toggled value', async() => {
      await instance.toggleDefaultBounce();
      expect(props.update).toHaveBeenCalledWith({ id: props.id, subaccount: 100, is_default_bounce_domain: true });

      props.domain.is_default_bounce_domain = true;
      await instance.toggleDefaultBounce();
      expect(props.update).toHaveBeenCalledWith({ id: props.id, subaccount: 100, is_default_bounce_domain: false });
    });

    it('on error reset form and rethrow the error', async() => {
      const err = new Error('Request failed!');
      props.update.mockReturnValue(Promise.reject(err));

      await expect(instance.toggleDefaultBounce()).rejects.toThrow(err);
      expect(props.update).toHaveBeenCalledWith({
        id: props.id,
        subaccount: 100,
        is_default_bounce_domain: true
      });
      expect(props.reset).toHaveBeenCalled();
    });
  });
});
