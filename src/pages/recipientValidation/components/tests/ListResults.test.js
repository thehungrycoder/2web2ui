import React from 'react';
import { shallow } from 'enzyme';
import { ListResults } from '../ListResults';

describe('ListResults', () => {
  let props;
  let wrapper;

  const testNotComplete = {
    listId: '123',
    complete: false
  };

  const testComplete = {
    listId: '456',
    complete: true
  };

  beforeEach(() => {
    props = {
      latestId: null,
      results: {},
      getLatestJob: jest.fn(),
      getJobStatus: jest.fn(() => Promise.resolve({ complete: false })),
      startPolling: jest.fn(),
      stopPolling: jest.fn(),
      showAlert: jest.fn()
    };

    wrapper = shallow(<ListResults {...props} />);
  });

  it('gets latest results on mount', () => {
    expect(props.getLatestJob).toHaveBeenCalled();
  });

  it('renders correctly with no latest results', () => {
    expect(wrapper.html()).toBe(null);
  });

  it('renders Results Card with latest results', () => {
    wrapper.setProps({ results: testNotComplete });
    expect(wrapper).toMatchSnapshot();
  });

  describe('polling', () => {
    it('starts polling when recieving new list id', async () => {
      wrapper.setProps({ results: testNotComplete, latestId: testNotComplete.listId });
      await expect(props.getJobStatus).toHaveBeenCalledWith(testNotComplete.listId);
      expect(props.stopPolling).toHaveBeenCalledTimes(1);
      expect(props.startPolling.mock.calls).toMatchSnapshot();
      expect(props.showAlert).not.toHaveBeenCalled();
    });

    it('should not start polling if new list id is complete', () => {
      wrapper.setProps({ results: testComplete, latestId: testComplete.listId });
      expect(props.stopPolling).toHaveBeenCalled();
      expect(props.getJobStatus).not.toHaveBeenCalled();
      expect(props.startPolling).not.toHaveBeenCalled();
    });

    it('starts shows an alert when polling results are complete', async () => {
      props.getJobStatus.mockReturnValue(Promise.resolve({ complete: true }));
      wrapper.setProps({ results: testNotComplete, latestId: testNotComplete.listId });
      await expect(props.getJobStatus).toHaveBeenCalledWith(testNotComplete.listId);
      expect(props.showAlert.mock.calls).toMatchSnapshot();
      expect(props.stopPolling).toHaveBeenCalledWith(testNotComplete.listId);
    });
  });
});
