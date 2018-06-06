import React from 'react';
import { shallow } from 'enzyme';

import { Support } from '../Support';
import findRouteByPath from 'src/helpers/findRouteByPath';

jest.mock('src/helpers/findRouteByPath');

describe('Support', () => {
  let props;
  let wrapper;

  const findTab = (content) => (
    wrapper.find('Tabs').prop('tabs').find((tab) => tab.content === content)
  );

  beforeEach(() => {
    findRouteByPath.mockImplementation(() => ({ path: '/example' }));
    props = {
      authorizedToCallSupport: true,
      authorizedToSubmitSupportTickets: true,
      closeSupportPanel: jest.fn(),
      currentSupportView: 'docs',
      location: {
        search: ''
      },
      loggedIn: true,
      openSupportPanel: jest.fn(),
      openSupportTicketForm: jest.fn(),
      showSupportPanel: true
    };

    wrapper = shallow(<Support {...props} />);
  });

  it('renders search panel by default', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders support form', () => {
    wrapper.setProps({ currentSupportView: 'ticket' });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders support contact panel', () => {
    wrapper.setProps({ currentSupportView: 'contact' });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders search panel with current page search term', () => {
    findRouteByPath.mockImplementationOnce(() => ({
      path: '/example',
      supportDocSearch: 'exampleKeyword'
    }));
    wrapper.setProps({ currentSupportView: 'docs' });

    expect(wrapper).toMatchSnapshot();
  });

  it('renders search panel without tabs', () => {
    wrapper.setProps({
      authorizedToCallSupport: false,
      authorizedToSubmitSupportTickets: false
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('renders closed support panel', () => {
    wrapper.setProps({ showSupportPanel: false });
    expect(wrapper.find('Modal').props()).toHaveProperty('open', false);
  });

  it('renders nothing when not logged in', () => {
    wrapper.setProps({ loggedIn: false });
    expect(wrapper.type()).toBeNull();
  });

  it('calls closeSupportPanel when modal is closed', () => {
    wrapper.find('Modal').simulate('close');
    expect(props.closeSupportPanel).toHaveBeenCalled();
  });

  it('calls closeSupportPanel when support form is closed', () => {
    wrapper.setProps({ currentSupportView: 'ticket' });
    wrapper.find('Connect(ReduxForm)').simulate('close');
    expect(props.closeSupportPanel).toHaveBeenCalled();
  });

  it('calls openSupportPanel when docs tab is clicked', () => {
    findTab('Search Help').onClick();
    expect(props.openSupportPanel).toHaveBeenCalledWith({ view: 'docs' });
  });

  it('calls openSupportPanel when ticket tab is clicked', () => {
    findTab('Submit A Ticket').onClick();
    expect(props.openSupportPanel).toHaveBeenCalledWith({ view: 'ticket' });
  });

  it('calls openSupportPanel when contact tab is clicked', () => {
    findTab('Contact Us').onClick();
    expect(props.openSupportPanel).toHaveBeenCalledWith({ view: 'contact' });
  });

  it('opens support ticket tab on mount with deep link', () => {
    const location = {
      search: '?supportTicket=true&supportIssue=test_issue&supportMessage=testmessage'
    };
    wrapper = shallow(<Support {...props} location={location} />);

    expect(props.openSupportTicketForm).toHaveBeenCalledWith({
      issueId: 'test_issue',
      message: 'testmessage'
    });
  });

  it('opens support ticket tab on location update with deep link', () => {
    wrapper.setProps({
      location: {
        search: '?supportTicket=true&supportIssue=test_issue&supportMessage=testmessage'
      }
    });

    expect(props.openSupportTicketForm).toHaveBeenCalledWith({
      issueId: 'test_issue',
      message: 'testmessage'
    });
  });

  it('only calls openSupportTicketForm once when location stays the same', () => {
    const search = '?supportTicket=true&supportIssue=test_issue&supportMessage=testmessage';
    wrapper.setProps({ location: { search }});
    wrapper.setProps({ location: { search }});

    expect(props.openSupportTicketForm).toHaveBeenCalledTimes(1);
  });
});
