import React from 'react';
import { shallow } from 'enzyme';
import { EventPage } from '../EventPage';

describe('Page: Event tests', () => {
  const props = {
    getMessageHistory: jest.fn(),
    getDocumentation: jest.fn(),
    history: {
      replace: jest.fn()
    },
    messageId: 'id',
    messageHistory: [
      { event_id: '1' },
      { event_id: '2' }
    ]
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<EventPage {...props} />);
  });

  it('should render page correctly', () => {
    expect(wrapper).toMatchSnapshot();
    expect(props.getDocumentation).toHaveBeenCalled();
    expect(props.getMessageHistory).toHaveBeenCalledWith({ messageId: props.messageId });
    expect(wrapper.state().selectedEventId).toEqual(null);
  });

  it('should handle location state', () => {
    wrapper.setProps({ selectedEventId: '1' });
    expect(wrapper.state().selectedEventId).toEqual('1');
    expect(props.history.replace).toHaveBeenCalled();
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle event click', () => {
    wrapper.instance().handleEventClick('eventId');
    expect(wrapper.state().selectedEventId).toEqual('eventId');
  });

  it('should render loading correctly', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper.find('Loading')).toHaveLength(1);
  });
});
