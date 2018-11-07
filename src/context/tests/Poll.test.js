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
    maxAttempts: 3,
    maxConsecutiveErrors: 2
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
    await next();
    expect(wrapper.state('actions').testAction).toMatchSnapshot();
  });

  it('should stop and not continue polling when stopPolling is invoked', async () => {
    const { startPolling, stopPolling } = wrapper.props().value;
    startPolling(testAction);
    stopPolling(testAction.key);
    const actions = wrapper.state('actions').testAction;
    expect(actions).toMatchSnapshot();

    await next();
    expect(wrapper.state('actions').testAction).toBe(actions);
  });

  it('should not stop if it isnt polling', async () => {
    const { startPolling, stopPolling } = wrapper.props().value;
    startPolling(testAction);
    stopPolling('different-key');
    expect(wrapper.state('actions').testAction.status).toBe('polling');
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
    expect(wrapper.state('actions').testAction.consecutiveErrors).toBe(1);
  });

  it('should reset error count on a success', async () => {
    const { startPolling } = wrapper.props().value;
    testAction.action.mockReturnValue(Promise.reject('error'));
    startPolling(testAction);
    await next();
    expect(wrapper.state('actions').testAction.consecutiveErrors).toBe(1);
    testAction.action.mockReturnValue(Promise.resolve('no error'));
    await next();
    expect(wrapper.state('actions').testAction.consecutiveErrors).toBe(0);
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
