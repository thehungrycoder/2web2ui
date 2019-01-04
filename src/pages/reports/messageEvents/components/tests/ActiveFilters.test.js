import React from 'react';
import { shallow } from 'enzyme';
import { ActiveFilters } from '../ActiveFilters';

describe('Component: ActiveFilters', () => {
  let wrapper;
  const props = {
    removeFilter: jest.fn(),
    updateMessageEventsSearchOptions: jest.fn(),
    search: {
      dateOptions: {
        to: 'to-date',
        from: 'from-date'
      },
      message_ids: []
    }
  };

  beforeEach(() => {
    wrapper = shallow(<ActiveFilters {...props} />);
  });

  it('should render nothing with no filters', () => {
    expect(wrapper.html()).toBe(null);
  });

  it('should render filters correctly', () => {
    const events = ['bounce', 'click', 'spam_complaint'];
    const message_ids = ['101', 102];
    const campaigns = [];
    wrapper.setProps({ search: { events, message_ids, campaigns }});
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle remove', () => {
    const events = ['bounce', 'click', 'spam_complaint'];
    wrapper.setProps({ search: { events }});
    wrapper.find('Tag').at(1).simulate('remove');
    expect(props.removeFilter).toHaveBeenCalledWith({ item: 'click', key: 'events' });
  });

  it('should handle remove all', () => {
    const events = ['bounce', 'click', 'spam_complaint'];
    wrapper.setProps({ search: { ...props.search, events }});
    wrapper.instance().handleRemoveAll();
    expect(props.updateMessageEventsSearchOptions).toHaveBeenCalledWith({
      ...props.search,
      events: [],
      message_ids: []
    });
  });
});
