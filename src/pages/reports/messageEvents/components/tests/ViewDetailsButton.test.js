import { shallow } from 'enzyme';
import React from 'react';

import { ViewDetailsButton } from '../ViewDetailsButton';

let props;

describe('Component ViewDetailsButton', () => {
  beforeEach(() => {
    props = {
      formattedDate: 'formatted',
      type: 'injection',
      friendly_from: 'mean@friendly',
      rcpt_to: 'tom.haverford@pawnee.state.in.us',
      message_id: '123abc',
      event_id: '456xyz',
      history: {
        push: jest.fn()
      }
    };
  });

  it('renders correctly', () => {
    expect(shallow(<ViewDetailsButton {...props} />)).toMatchSnapshot();
  });

  it('renders nothing if message_id is abset', () => {
    delete props.message_id;
    expect(shallow(<ViewDetailsButton {...props} />)).toMatchSnapshot();
  });

  it('should handle view details click', () => {
    const wrapper = shallow(<ViewDetailsButton {...props} />);
    wrapper.instance().handleDetailClick({ message_id: 'message', event_id: 'event' });
    expect(props.history.push).toHaveBeenCalledWith({
      pathname: '/reports/message-events/details/message',
      state: { selectedEventId: 'event' }
    });
  });

  describe('button', () => {
    it('calls handleDetailClick upon click', () => {
      const wrapper = shallow(<ViewDetailsButton {...props} />);
      const instance = wrapper.instance();
      instance.handleDetailClick = jest.fn();

      wrapper.find('Button').simulate('click');
      expect(instance.handleDetailClick).toHaveBeenLastCalledWith({ message_id: '123abc', event_id: '456xyz' });
    });
  });

});
