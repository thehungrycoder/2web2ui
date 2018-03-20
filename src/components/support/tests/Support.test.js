import React from 'react';
import { shallow } from 'enzyme';

import { Support } from '../Support';

describe('Support Component', () => {
  const ticket = {
    subject: 'subject',
    message: 'message'
  };
  const createTicketResult = {
    ticket_id: 103339
  };
  let wrapper;
  let createTicket;
  let clearSupportForm;
  let props;
  let instance;

  beforeEach(() => {
    createTicket = jest.fn().mockImplementation(() => Promise.resolve(createTicketResult));
    clearSupportForm = jest.fn();

    props = { createTicket, clearSupportForm, entitledToSupport: true, loggedIn: true };
    wrapper = shallow(<Support {...props} />);
    instance = wrapper.instance();
  });

  describe('render tests', () => {
    it('should not render the icon if the account is not entitled to support', () => {
      wrapper.setProps({ entitledToSupport: false });
      expect(wrapper.get(0)).toBeFalsy();
    });

    it('should not render icon if account is not logged in', () => {
      wrapper.setProps({ loggedIn: false });
      expect(wrapper.get(0)).toBeFalsy();
    });

    it('should render just the icon by default', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should show search panel and close icon when panel is opened', () => {
      wrapper.setState({ showPanel: true });
      expect(wrapper).toMatchSnapshot();
    });

    it('should show form and close icon when panel is opened and form is toggled', () => {
      wrapper.setState({ showPanel: true, showForm: true });
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('toggleForm/Panel tests tests', () => {
    it('should toggle panel', () => {
      expect(wrapper.state('showPanel')).toBeFalsy();
      expect(wrapper.state('showForm')).toBeFalsy();
      instance.togglePanel();
      expect(wrapper.state('showPanel')).toBeTruthy();
      instance.togglePanel();
      expect(wrapper.state('showPanel')).toBeFalsy();
      expect(wrapper.state('showForm')).toBeFalsy();
    });

    it('should toggle form', () => {
      expect(wrapper.state('showForm')).toBeFalsy();
      instance.toggleForm();
      expect(wrapper.state('showForm')).toBeTruthy();
    });
  });

  describe('onSubmit tests', () => {
    it('should create a ticket on submit', async() => {
      wrapper.setState({ showForm: true });
      await expect(instance.onSubmit(ticket)).resolves.toBeDefined();
      expect(createTicket).toHaveBeenCalled();
    });

    it('should show an alert on submission failure', async() => {
      createTicket.mockReturnValueOnce(Promise.reject({}));
      await expect(instance.onSubmit(ticket)).rejects.toBeDefined();
    });
  });

  describe('resetPanel tests', () => {
    it('should clear out form state on reset', () => {
      instance.resetPanel();
      expect(clearSupportForm).toHaveBeenCalled();
    });
  });

});
