import { shallow } from 'enzyme';
import React from 'react';

import { EditBounce } from '../EditBounce';

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
        status
      },
      verify: jest.fn(() => Promise.resolve()),
      showAlert: jest.fn()
    };

    wrapper = shallow(<EditBounce {...props}/>);
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
    let instance;
    beforeEach(() => {
      instance = wrapper.instance();
    });

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
});
