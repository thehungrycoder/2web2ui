import sparkpostApiRequest from './helpers/sparkpostApiRequest';

export function createTicket({ subject, message }) {
  return sparkpostApiRequest({
    type: 'CREATE_TICKET',
    meta: {
      method: 'POST',
      url: '/integrations/support/ticket',
      data: {
        subject,
        message
      }
    }
  });
}

export function clearSupportForm() {
  return {
    type: 'RESET_SUPPORT_FORM'
  };
}

