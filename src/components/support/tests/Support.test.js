import React from 'react';
import { shallow } from 'enzyme';

import { Support } from '../Support';

describe('Support', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      authorizedToSubmitSupportTickets: true,
      closeSupportPanel: jest.fn(),
      currentSupportView: 'docs',
      location: {
        search: ''
      },
      loggedIn: true,
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

  it('renders search panel without tabs when unauthorized to submit tickets', () => {
    wrapper.setProps({ authorizedToSubmitSupportTickets: false });
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
