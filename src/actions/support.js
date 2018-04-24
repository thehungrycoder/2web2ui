import sparkpostApiRequest from './helpers/sparkpostApiRequest';
import { change } from 'redux-form';

// Toggles the support panel UI
export function toggleSupportPanel() {
  return {
    type: 'TOGGLE_SUPPORT_PANEL'
  };
}

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

export function clearTicketForm() {
  return {
    type: 'RESET_TICKET_FORM'
  };
}

// Toggles support ticket form (algolia search shown when false)
export function toggleTicketForm() {
  return {
    type: 'TOGGLE_TICKET_FORM'
  };
}

// Fills support ticket form values
export function hydrateTicketForm({ message, subject } = {}) {
  const formName = 'supportForm'; // Must match the form name used in SupportForm component

  return (dispatch) => {
    if (message) {
      dispatch(change(formName, 'message', message));
    }

    if (subject) {
      dispatch(change(formName, 'subject', subject));
    }

    return {
      type: 'HYDRATE_TICKET_FORM'
    };
  };
}
