import React from 'react';
import { shallow } from 'enzyme';
import { ActiveFilters } from '../ActiveFilters';

describe('Component: ActiveFilters', () => {
  let wrapper;
  const props = {
    removeFilter: jest.fn(),
    search: {
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
    const campaign_ids = [];
    wrapper.setProps({ search: { events, message_ids, campaign_ids }});
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle remove', () => {
    const events = ['bounce', 'click', 'spam_complaint'];
    wrapper.setProps({ search: { events }});
    wrapper.find('Tag').at(1).simulate('remove');
    expect(props.removeFilter).toHaveBeenCalledWith({ item: 'click', key: 'events' });
  });
});
