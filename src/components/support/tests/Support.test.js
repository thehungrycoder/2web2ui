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

  beforeEach(() => {
    createTicket = jest.fn().mockImplementation(() => Promise.resolve(createTicketResult));
    clearSupportForm = jest.fn();

    props = { createTicket, clearSupportForm, entitledToSupport: true, loggedIn: true };
    wrapper = shallow(<Support {...props} />);
  });

  it('should not render the icon if the account is not entitled to support', () => {
    const localProps = { ...props, entitledToSupport: false };
    wrapper = shallow(<Support {...localProps} />);
    expect(wrapper.get(0)).toBeFalsy();
  });

  it('should render just the icon by default', () => {
    expect(wrapper.get(0)).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it('should toggle', () => {
    expect(wrapper.state('showPanel')).toBeFalsy();
    wrapper.instance().togglePanel();
    expect(wrapper.state('showPanel')).toBeTruthy();
  });

  it('should create a ticket on submit', async() => {
    await expect(wrapper.instance().onSubmit(ticket)).resolves.toBeDefined();
    expect(createTicket).toHaveBeenCalled();
  });

  it('should show an alert on submission failure', async() => {
    createTicket.mockReturnValueOnce(Promise.reject({}));
    await expect(wrapper.instance().onSubmit(ticket)).rejects.toBeDefined();
  });

  it('should clear out form state on reset', () => {
    wrapper.instance().resetPanel();
    expect(clearSupportForm).toHaveBeenCalled();
  });
});
