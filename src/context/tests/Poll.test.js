import React from 'react';
import Poll from '../Poll';
import { shallow } from 'enzyme';

describe('Poll Provider', () => {
  let wrapper;
  let next;

  const testAction = {
    key: 'testAction',
    action: jest.fn(),
    interval: 50,
    maxAttempts: 2
  };

  beforeEach(() => {
    window.setTimeout = jest.fn((fn) => next = fn);
    wrapper = shallow(<Poll>child</Poll>);
  });

  it('should render children with the correct state', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should start and finish polling', () => {
    const { startPolling } = wrapper.props().value;

    startPolling(testAction);
    next();
    next();

    expect(wrapper.state('actions').testAction).toMatchSnapshot();
  });

  it('should start and stop polling when stopPolling is invoked', async () => {
    const { startPolling, stopPolling } = wrapper.props().value;

    startPolling(testAction);
    stopPolling(testAction.key);

    expect(wrapper.state('actions').testAction).toMatchSnapshot();
  });
});
