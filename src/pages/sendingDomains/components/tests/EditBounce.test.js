import { shallow } from 'enzyme';
import React from 'react';

import { EditBounce } from '../EditBounce';
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
        is_default_bounce_domain: false
      },
      verify: jest.fn(() => Promise.resolve()),
      update: jest.fn(() => Promise.resolve()),
      showAlert: jest.fn()
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

  describe('verifyDomain', () => {
    it('verifies domain and alerts when verification successful', async() => {
      props.verify.mockReturnValue(Promise.resolve({ cname_status: 'valid' }));
      await instance.verifyDomain();
      expect(props.verify).toHaveBeenCalledOnceWith('xyz.com', 'cname');
      const arg = props.showAlert.mock.calls[0][0];
      expect(props.showAlert).toHaveBeenCalledTimes(1);
      expect(arg.type).toEqual('success');
      expect(arg.message).toMatch(/successfully verified/);
    });

    it('alerts error when verification req is successful but verification is failed', async() => {
      props.verify.mockReturnValue(Promise.resolve({ cname_status: 'invalid' }));
      await instance.verifyDomain();
      expect(props.verify).toHaveBeenCalledOnceWith('xyz.com', 'cname');
      const arg = props.showAlert.mock.calls[0][0];
      expect(props.showAlert).toHaveBeenCalledTimes(1);
      expect(arg.type).toEqual('error');
      expect(arg.message).toMatch(/Unable to verify CNAME/);
    });

    it('alerts when request is errored', async() => {
      const err = new Error('Request failed!');
      props.verify.mockReturnValue(Promise.reject(err));
      await instance.verifyDomain();
      expect(props.verify).toHaveBeenCalledOnceWith('xyz.com', 'cname');
      const arg = props.showAlert.mock.calls[0][0];
      expect(props.showAlert).toHaveBeenCalledTimes(1);
      expect(arg.type).toEqual('error');
      expect(arg.message).toMatch(/Request failed/);
    });
  });

  describe('toggleDefaultBounce', () => {
    it('calls update with toggled value', async() => {
      await instance.toggleDefaultBounce();
      expect(props.update).toHaveBeenCalledWith(props.id, { is_default_bounce_domain: true });

      props.domain.is_default_bounce_domain = true;
      await instance.toggleDefaultBounce();
      expect(props.update).toHaveBeenCalledWith(props.id, { is_default_bounce_domain: false });
    });

    it('alerts on error', async() => {
      const err = new Error('Request failed!');
      props.update.mockReturnValue(Promise.reject(err));

      await instance.toggleDefaultBounce();
      expect(props.update).toHaveBeenCalledOnceWith(props.id, { is_default_bounce_domain: true });
      expect(props.showAlert).toHaveBeenCalledTimes(1);
      expect(props.showAlert.mock.calls[0][0].type).toEqual('error');
    });
  });
});
