import React from 'react';
import { shallow } from 'enzyme';

import Cookies from 'js-cookie';
import { SiftScience } from '../SiftScience';

jest.mock('js-cookie');
jest.mock('uuid/v4', () => jest.fn(() => 'new-test-session-id'));

describe('SiftScience', () => {
  let wrapper;

  beforeEach(() => {
    delete window._sift;
    Cookies.get = jest.fn();
    wrapper = shallow(
      <SiftScience
        config={{ id: 'test-id' }}
        location={{ pathname: '/auth' }}
      />
    );
  });

  it('renders the snippet', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('sends setup events', () => {
    expect(window._sift).toMatchSnapshot();
  });

  it('sends update event when customer changes', () => {
    wrapper.setProps({ customer: '123456' });
    expect(window._sift).toMatchSnapshot();
  });

  it('sends update event when page changes', () => {
    wrapper.setProps({ location: { pathname: '/dashboard' }});
    expect(window._sift).toMatchSnapshot();
  });

  describe('getPrefixedCustomer', () => {
    it('returns empty string', () => {
      const customer = wrapper.instance().getPrefixedCustomer();
      expect(customer).toEqual('');
    });

    it('returns customer id', () => {
      wrapper.setProps({ customer: 123 });
      const customer = wrapper.instance().getPrefixedCustomer();
      expect(customer).toEqual('123');
    });

    it('returns prefixed customer id', () => {
      wrapper.setProps({
        config: { accountPrefix: 'test-' },
        customer: 123
      });
      const customer = wrapper.instance().getPrefixedCustomer();
      expect(customer).toEqual('test-123');
    });
  });

  describe('findOrCreateSessionId', () => {
    it('returns current session id', () => {
      Cookies.get = jest.fn(() => 'test-session-id');
      const sessionId = wrapper.instance().findOrCreateSessionId();
      expect(sessionId).toEqual('test-session-id');
    });

    it('returns new session id and sets cookie', () => {
      const sessionId = wrapper.instance().findOrCreateSessionId();

      expect(Cookies.set).toHaveBeenCalledWith('_sp_session_id', 'new-test-session-id', {
        domain: '.sparkpost.com',
        expires: 1
      });
      expect(sessionId).toEqual('new-test-session-id');
    });
  });
});
