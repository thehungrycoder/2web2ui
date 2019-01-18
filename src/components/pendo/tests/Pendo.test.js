import React from 'react';
import { shallow } from 'enzyme';
import { Pendo } from '../Pendo';

describe('Component: Pendo', () => {
  beforeEach(() => {
    window.pendo = {
      initialize: jest.fn()
    };
  });

  const subject = (props) => shallow(<Pendo
    accessControlReady={false}
    accountId={999999}
    accountPlanCode='1meellion'
    accountSvcLevel='enterprise'
    username='fredo-mcgurk'
    userAccessLevel='admin'
    {...props}
  />);

  it('should initialise Pendo', () => {
    const wrapper = subject();
    wrapper.setProps({ accessControlReady: true });
    expect(window.pendo.initialize).toHaveBeenCalledTimes(1);
    expect(window.pendo.initialize.mock.calls[0]).toMatchSnapshot();
  });

  it('...once', () => {
    const wrapper = subject();
    wrapper.setProps({ accessControlReady: true });
    wrapper.setProps({ accessControlReady: true });
    expect(window.pendo.initialize).toHaveBeenCalledTimes(1);
  });

  it('...iff pendo is available', () => {
    delete window.pendo;
    const wrapper = subject();
    const update = new Promise((resolve, reject) => {
      try {
        wrapper.setProps({ accessControlReady: true });
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
    expect(update).resolves.toBe(true);
  });

  it('...after access control is ready', () => {
    subject();
    expect(window.pendo.initialize).not.toHaveBeenCalled();
  });
});
