import React from 'react';
import { shallow } from 'enzyme';
import { MessageEventsPage } from '../MessageEventsPage';

describe('Page: Message Events tests', () => {
  const props = {
    empty: false,
    error: null,
    loading: false,
    getMessageEvents: jest.fn(() => []),
    events: [
      {
        formattedDate: 'so-formatted',
        type: 'delivery',
        friendly_from: 'hi@friendly',
        rcpt_to: 'ron.swanson@pawnee.state.in.us'
      },
      {
        formattedDate: 'formatted',
        type: 'injection',
        friendly_from: 'mean@friendly',
        rcpt_to: 'tom.haverford@pawnee.state.in.us'
      }
    ]
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<MessageEventsPage {...props} />);
  });

  it('should render page correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render error when action fails', () => {
    wrapper.setProps({ error: { message: 'You done f\'ed up now' } });
    expect(wrapper).toMatchSnapshot();
  });

  it('should only render loading component while loading', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render the empty message when 0 results are returned', () => {
    wrapper.setProps({ empty: true });
    expect(wrapper).toMatchSnapshot();
  });

});
