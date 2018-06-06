import * as support from '../support';
import * as formActions from 'redux-form';

jest.mock('../helpers/sparkpostApiRequest', () => jest.fn((a) => a));

describe('Action Creator: Support', () => {
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = jest.fn((a) => a);
    formActions.change = jest.fn((a) => a);
  });

  it('should close support panel', () => {
    const action = support.closeSupportPanel();
    expect(action).toMatchSnapshot();
  });

  it('should open support panel', () => {
    const action = support.openSupportPanel();
    expect(action).toMatchSnapshot();
  });

  it('should open support panel with specific view', () => {
    const action = support.openSupportPanel({ view: 'ticket' });
    expect(action).toMatchSnapshot();
  });

  describe('openSupportTicketForm', () => {
    it('should open support panel', () => {
      support.openSupportTicketForm()(dispatchMock);
      expect(dispatchMock).toMatchSnapshot();
    });

    it('should open support panel and set support ticket message', () => {
      support.openSupportTicketForm({ message: 'test' })(dispatchMock);
      expect(formActions.change).toHaveBeenCalledWith('supportForm', 'message', 'test');
      expect(formActions.change).toHaveBeenCalledTimes(1);
    });

    it('should open support panel ane set support ticket issue', () => {
      support.openSupportTicketForm({ issueId: 'technical_errors' })(dispatchMock);
      expect(formActions.change).toHaveBeenCalledWith('supportForm', 'issueId', 'technical_errors');
      expect(formActions.change).toHaveBeenCalledTimes(1);
    });
  });

  describe('createTicket', () => {
    it('should create a ticket', () => {
      const ticket = { issueType: 'billing', subject: 'sub', message: 'mess' };
      expect(support.createTicket(ticket)).toMatchSnapshot();
    });
  });
});
