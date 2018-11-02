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
      getLatest: jest.fn(),
      getStatus: jest.fn(),
      startPolling: jest.fn(),
      stopPolling: jest.fn()
    };

    wrapper = shallow(<ListResults {...props} />);
  });

  it('gets latest results on mount', () => {
    expect(props.getLatest).toHaveBeenCalled();
  });

  it('renders correctly with no latest results', () => {
    expect(wrapper.html()).toBe(null);
  });

  it('renders Results Card with latest results', () => {
    wrapper.setProps({ results: testNotComplete });
    expect(wrapper).toMatchSnapshot();
  });

  describe('polling', () => {
    it('starts polling when recieving new list id', () => {
      wrapper.setProps({ results: testNotComplete, latestId: testNotComplete.listId });
      expect(props.stopPolling).toHaveBeenCalledTimes(1);
      expect(props.getStatus).toHaveBeenCalledWith(testNotComplete.listId);
      expect(props.startPolling.mock.calls).toMatchSnapshot();
    });

    it('should not start polling if new list id is complete', () => {
      wrapper.setProps({ results: testComplete, latestId: testComplete.listId });
      expect(props.stopPolling).toHaveBeenCalled();
      expect(props.getStatus).not.toHaveBeenCalled();
      expect(props.startPolling).not.toHaveBeenCalled();
    });

    it('should stop polling when new results are complete', () => {
      wrapper.setProps({ latestId: testComplete.listId });
      jest.clearAllMocks();
      wrapper.setProps({ results: testComplete });
      expect(props.stopPolling).toHaveBeenCalledTimes(1);
      expect(props.stopPolling).toHaveBeenCalledWith(testComplete.listId);
    });
  });
});
