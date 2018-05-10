import * as support from '../support';
import * as formActions from 'redux-form';

jest.mock('../helpers/sparkpostApiRequest', () => jest.fn((a) => a));

describe('Action Creator: Support', () => {
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = jest.fn((a) => a);
    formActions.change = jest.fn((a) => a);
  });

  describe('toggleSupportPanel', () => {
    it('should toggle panel', () => {
      expect(support.toggleSupportPanel()).toMatchSnapshot();
    });
  });

  describe('clearTicketForm', () => {
    it('should clear ticket form', () => {
      expect(support.clearTicketForm()).toMatchSnapshot();
    });
  });

  describe('toggleTicketForm', () => {
    it('should toggle ticket form', () => {
      expect(support.toggleTicketForm()).toMatchSnapshot();
    });
  });

  describe('openSupportTicket', () => {

    it('should open support panel', () => {
      support.openSupportTicket()(dispatchMock);
      expect(dispatchMock).toMatchSnapshot();
    });

    it('should open support panel and set support ticket message', () => {
      support.openSupportTicket({ message: 'test' })(dispatchMock);
      expect(formActions.change).toHaveBeenCalledWith('supportForm', 'message', 'test');
      expect(formActions.change).toHaveBeenCalledTimes(1);
    });

    it('should open support panel ane set support ticket issue', () => {
      support.openSupportTicket({ issueId: 'technical_errors' })(dispatchMock);
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
