import React from 'react';
import { shallow } from 'enzyme';

import { Support } from '../Support';
import SupportForm from '../components/SupportForm';

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
  let showAlert;

  beforeEach(() => {
    createTicket = jest.fn().mockImplementation(() => Promise.resolve(createTicketResult));

    clearSupportForm = jest.fn();
    showAlert = jest.fn();

    const props = { createTicket, clearSupportForm, showAlert };
    wrapper = shallow(<Support {...props} />);
  });

  it('should render just the icon by default', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should toggle', () => {
    expect(wrapper.state('showPanel')).toBeFalsy();
    wrapper.instance().togglePanel();
    expect(wrapper.state('showPanel')).toBeTruthy();
  });

  it('should create a ticket on submit', async () => {
    await expect(wrapper.instance().onSubmit(ticket)).resolves.toBeDefined();
    expect(createTicket).toHaveBeenCalled();
  });

  it('should show an alert on submission failure', async () => {
    createTicket.mockReturnValueOnce(Promise.reject({}));
    await expect(wrapper.instance().onSubmit(ticket)).rejects.toBeDefined();
    expect(showAlert).toHaveBeenCalled();
  });

  it('should clear out form state on reset', () => {
    wrapper.instance().resetPanel();
    expect(clearSupportForm).toHaveBeenCalled();
  })
});
