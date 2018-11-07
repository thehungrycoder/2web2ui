import React from 'react';
import Poll from '../Poll';
import { shallow } from 'enzyme';

describe('Poll Provider', () => {
  let wrapper;
  let next;

  const testAction = {
    key: 'testAction',
    action: jest.fn(() => Promise.resolve()),
    interval: 50,
    maxAttempts: 3
  };

  beforeEach(() => {
    window.setTimeout = jest.fn((fn) => next = fn);
    wrapper = shallow(<Poll>child</Poll>);
  });

  it('should render children with the correct state', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should start and finish polling', async () => {
    const { startPolling } = wrapper.props().value;

    startPolling(testAction);
    await next();
    await next();

    expect(wrapper.state('actions').testAction).toMatchSnapshot();
  });

  it('should start and stop polling when stopPolling is invoked', async () => {
    const { startPolling, stopPolling } = wrapper.props().value;
    startPolling(testAction);
    stopPolling(testAction.key);
    expect(wrapper.state('actions').testAction).toMatchSnapshot();
  });

  it('should not stop if it isnt polling', async () => {
    const { stopPolling } = wrapper.props().value;
    stopPolling(testAction.key);
    expect(wrapper.state('actions')).toMatchSnapshot();
  });

  it('should not start if its already polling', async () => {
    const { startPolling } = wrapper.props().value;
    startPolling(testAction);
    await next();
    startPolling(testAction);
    expect(wrapper.state('actions').testAction).toMatchSnapshot();
  });

  it('should increment consecutive errors', async () => {
    const { startPolling } = wrapper.props().value;
    testAction.action.mockReturnValue(Promise.reject('error'));
    startPolling(testAction);
    await next();
    expect(wrapper.state('actions').testAction).toMatchSnapshot();
  });

  it('should reset error count on a success', async () => {
    const { startPolling } = wrapper.props().value;
    testAction.action.mockReturnValue(Promise.reject('error'));
    startPolling(testAction);
    await next();
    expect(wrapper.state('actions').testAction).toMatchSnapshot();
    testAction.action.mockReturnValue(Promise.resolve('no error'));
    await next();
    expect(wrapper.state('actions').testAction).toMatchSnapshot();
  });

  it('should stop polling when consecutive errors is more than 2', async () => {
    const { startPolling } = wrapper.props().value;
    testAction.action.mockReturnValue(Promise.reject('error'));
    startPolling(testAction);
    await next();
    await next();
    await next();
    expect(wrapper.state('actions').testAction).toMatchSnapshot();
  });
});
