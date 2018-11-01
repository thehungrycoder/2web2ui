import React from 'react';
import Poll from '../Poll';
import { shallow } from 'enzyme';
import delay from 'src/__testHelpers__/delay';

describe('Poll Provider', () => {
  let wrapper;

  const testAction = {
    key: 'testAction',
    action: jest.fn(),
    interval: 50,
    maxAttempts: 5
  };

  beforeEach(() => {
    wrapper = shallow(<Poll>child</Poll>);
  });

  it('should render children with the correct state', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should start and finish polling', async () => {
    const { startPolling } = wrapper.props().value;
    startPolling(testAction);

    // Check polling state
    expect(wrapper.props().value.actions.testAction).toMatchSnapshot();

    await delay(300);

    // Check done state
    expect(wrapper.props().value.actions.testAction.action.mock.calls).toHaveLength(5);
    expect(wrapper.props().value.actions.testAction.attempts).toBe(5);
    expect(wrapper.props().value.actions.testAction.status).toBe('done');
  });

  it('should start and stop polling when stopPolling is invoked', async () => {
    const { startPolling, stopPolling } = wrapper.props().value;
    startPolling(testAction);

    expect(wrapper.props().value.actions.testAction.status).toBe('polling');
    stopPolling(testAction.key);
    expect(wrapper.props().value.actions.testAction.status).toBe('stopped');
  });
});
