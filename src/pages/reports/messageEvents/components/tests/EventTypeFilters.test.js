import React from 'react';
import { shallow } from 'enzyme';
import EventTypeFilters from '../eventTypeFilters';

describe('EventTypeFilters', () => {
  let props;

  beforeEach(() => {
    props = {
      eventTypes: ['amp_open', 'bounce'],
      checkedTypes: {},
      onChange: jest.fn()
    };
  });

  it('should render from a list of event types', () => {
    const wrapper = shallow(<EventTypeFilters {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render checked state', () => {
    props.checkedTypes.bounce = true;
    const wrapper = shallow(<EventTypeFilters {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
