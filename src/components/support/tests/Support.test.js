import React from 'react';
import { shallow } from 'enzyme';
import { Support } from '../Support';

describe('Support Component', () => {
  let wrapper;
  let instance;

  beforeEach(() => {
    const props = {
      loggedIn: true,
      location: {},
      openSupportTicketForm: jest.fn(),
      toggleSupportPanel: jest.fn(),
      toggleTicketForm: jest.fn(),
      showPanel: false,
      showTicketForm: false
    };
    wrapper = shallow(<Support {...props} />);
    instance = wrapper.instance();
  });

  describe('render tests', () => {
    it('should render just the icon by default', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render icon if account is not logged in', () => {
      wrapper.setProps({ loggedIn: false });
      expect(wrapper.get(0)).toBeFalsy();
    });

    it('should show search panel and close icon when panel is opened', () => {
      wrapper.setProps({ showPanel: true });
      expect(wrapper).toMatchSnapshot();
    });

    it('should show form and close icon when panel is opened and form is toggled', () => {
      wrapper.setProps({ showPanel: true, showTicketForm: true });
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('on mount', () => {
    it('should open panel and hydrate form if search value is present', () => {
      wrapper.setProps({ location: { search: '?supportTicket=true&supportIssue=test_issue&supportMessage=testmessage' }});

      expect(instance.props.openSupportTicketForm).toHaveBeenCalledWith(expect.objectContaining({
        issueId: 'test_issue',
        message: 'testmessage'
      }));
    });

    it('should not open panel or hydrate form if search value is not present', () => {
      expect(instance.props.openSupportTicketForm).not.toHaveBeenCalled();
    });
  });

  describe('on update', () => {
    it('should open panel and hydrate form if location changes and search value is present', () => {
      wrapper.setProps({ location: { search: '?supportTicket=true&supportMessage=testmessage' }});
      expect(instance.props.openSupportTicketForm).toHaveBeenCalledWith(expect.objectContaining({ message: 'testmessage' }));
    });

    it('should not open panel or hydrate form if search does not change', () => {
      wrapper.setProps({ location: { search: '?supportTicket=true,supportMessage=testmessage' }});
      wrapper.setProps({ location: { search: '?supportTicket=true,supportMessage=testmessage' }});

      expect(instance.props.openSupportTicketForm).toHaveBeenCalledTimes(1);
    });

    it('should not open panel or hydrate form if search value is not present', () => {
      wrapper.setProps({ location: { search: '?supportTicket=true,supportMessage=testmessage' }});
      wrapper.setProps({ location: { search: undefined }});

      expect(instance.props.openSupportTicketForm).toHaveBeenCalledTimes(1);
    });
  });

  describe('toggleForm/Panel tests', () => {
    it('should toggle panel', () => {
      expect(wrapper.state('showPanel')).toBeFalsy();
      expect(wrapper.state('showForm')).toBeFalsy();
      instance.togglePanel();
      expect(instance.props.toggleSupportPanel).toHaveBeenCalledTimes(1);
      expect(instance.props.toggleTicketForm).not.toHaveBeenCalled();
    });

    it('should reset to search panel if ticket form was open when closed', () => {
      wrapper.setProps({ showTicketForm: true });
      instance.togglePanel();
      expect(instance.props.toggleTicketForm).toHaveBeenCalledTimes(1);
      expect(instance.props.toggleSupportPanel).toHaveBeenCalledTimes(1);
    });

    it('should toggle form', () => {
      instance.toggleForm();
      expect(instance.props.toggleTicketForm).toHaveBeenCalledTimes(1);
    });
  });
});
