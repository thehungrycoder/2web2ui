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

  it('renders nothing if message_id is absent', () => {
    delete props.message_id;
    expect(shallow(<ViewDetailsButton {...props} />)).toMatchSnapshot();
  });
});
