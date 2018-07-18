import React from 'react';
import { shallow } from 'enzyme';
import { EventPage } from '../EventPage';

describe('Page: Event tests', () => {
  const props = {
    getMessageHistory: jest.fn(),
    getDocumentation: jest.fn(),
    history: {
      replace: jest.fn(),
      push: jest.fn()
    },
    messageId: 'id',
    messageHistory: [
      { event_id: '1' },
      { event_id: '2' }
    ],
    isOrphanEvent: false,
    match: {
      params: {}
    }
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<EventPage {...props} />);
  });

  it('should render page correctly', () => {
    expect(wrapper).toMatchSnapshot();
    expect(props.getDocumentation).toHaveBeenCalled();
    expect(props.getMessageHistory).toHaveBeenCalledWith({ messageId: props.messageId });
  });

  it('redirects old path (w/o eventId) to new path', () => {
    wrapper.setProps({ selectedEventId: 1, loading: true });
    wrapper.setProps({ loading: false });
    expect(props.history.replace).toHaveBeenCalledWith('/reports/message-events/details/id/1');
  });

  it('redirects to list page if event_id not found', () => {
    wrapper.setProps({ isOrphanEvent: true, selectedEvent: null, selectedEventId: 3, loading: true });
    wrapper.setProps({ loading: false });
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle event click by pushing new state', () => {
    wrapper.instance().handleEventClick('eventId');
    expect(props.history.push).toHaveBeenCalledWith('/reports/message-events/details/id/eventId');
  });

  it('should render loading correctly', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper.find('Loading')).toHaveLength(1);
  });

  it('should redirect when no message events', () => {
    wrapper.setProps({ isMessageHistoryEmpty: true, isOrphanEvent: false, loading: true });
    wrapper.setProps({ loading: false });
    expect(wrapper).toMatchSnapshot();
  });

  describe('handleRefresh', () => {
    let instance;
    beforeEach(() => {
      instance = wrapper.instance();
      props.getMessageHistory.mockReset();
    });

    it('invokes getMessageHistory if not orphan event', () => {
      instance.handleRefresh();
      expect(props.getMessageHistory).toHaveBeenCalledWith({ messageId: 'id' });
    });

    it('does not invoke getMessageHistory if it is an orphan event', () => {
      wrapper.setProps({ isOrphanEvent: true });
      instance.handleRefresh();
      expect(props.getMessageHistory).toHaveBeenCalledTimes(0);
    });
  });
});
