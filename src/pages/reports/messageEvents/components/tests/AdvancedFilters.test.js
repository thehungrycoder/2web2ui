import React from 'react';
import { shallow } from 'enzyme';
import { AdvancedFilters } from '../AdvancedFilters';

describe('Component: ActiveFilters', () => {
  let wrapper;
  const props = {
    updateMessageEventsSearchOptions: jest.fn(),
    getDocumentation: jest.fn(),
    eventListing: ['amp_open', 'bounce', 'click', 'delivery'],
    search: {
      events: ['bounce', 'click'],
      friendly_froms: ['test@testy.co'],
      campaign_ids: []
    }
  };

  const initialDerivedSearchState = {
    campaign_ids: [],
    events: { bounce: true, click: true },
    friendly_froms: ['test@testy.co']
  };

  beforeEach(() => {
    wrapper = shallow(<AdvancedFilters {...props} />);
  });

  it('should render initially and sync to state correctly', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.state().search).toEqual(initialDerivedSearchState);
  });

  it('should re-sync to state if search props change', () => {
    wrapper.setProps({ search: { ...props.search, events: []}});
    expect(wrapper.state().search).toEqual({ ...initialDerivedSearchState, events: {}});
  });

  it('should not re-sync to state if another prop changes', () => {
    const spy = jest.spyOn(wrapper.instance(), 'syncSearchToState');
    wrapper.setProps({ another: 'prop', search: props.search });
    expect(spy).not.toHaveBeenCalled();
  });

  it('should open modal', () => {
    wrapper.find('Button').at(0).simulate('click');
    expect(wrapper.state().modalOpen).toEqual(true);
  });

  it('should handle filter changes and correctly apply', () => {
    wrapper.find('Button').at(0).simulate('click'); // Open modal
    wrapper.find('Checkbox').at(0).simulate('change'); // Check bounce
    wrapper.find('TextField').at(1).simulate('change', { target: { value: '101' }}); // Subaccount field
    expect(wrapper.state().search).toMatchSnapshot();

    wrapper.find('Button').at(1).simulate('click'); // Apply button
    expect(props.updateMessageEventsSearchOptions).toHaveBeenCalledWith({
      campaign_ids: [],
      events: ['bounce', 'click', 'amp_open'],
      friendly_froms: ['test@testy.co'],
      subaccounts: ['101']
    });
    expect(wrapper.state().modalOpen).toEqual(false); // Check modal is closed
  });

  it('should handle keydown', () => {
    const applySpy = jest.spyOn(wrapper.instance(), 'handleApply');
    const toggleSpy = jest.spyOn(wrapper.instance(), 'toggleModal');
    wrapper.instance().handleKeyDown({ key: 'Enter' });
    wrapper.instance().handleKeyDown({ key: 'Escape' });
    expect(applySpy).not.toHaveBeenCalled();
    expect(toggleSpy).not.toHaveBeenCalled();

    wrapper.find('Button').at(0).simulate('click'); // Open modal
    wrapper.instance().handleKeyDown({ key: 'Enter' });
    expect(applySpy).toHaveBeenCalledTimes(1);

    wrapper.find('Button').at(0).simulate('click'); // Open modal
    wrapper.instance().handleKeyDown({ key: 'Escape' });
    expect(applySpy).toHaveBeenCalledTimes(1);
    expect(toggleSpy).toHaveBeenCalledTimes(3);
  });
});
