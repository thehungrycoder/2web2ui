import _ from 'lodash';
import sparkpostApiRequest from './helpers/sparkpostApiRequest';
import { change } from 'redux-form';
import { formName } from 'src/components/support/components/SupportForm';
import { selectSupportIssues } from 'src/selectors/support';

export function closeSupportPanel() {
  return {
    type: 'CLOSE_SUPPORT_PANEL'
  };
}

/**
 * Forces the support panel open rather than blindly toggling, good
 * for places where we know we want to open it and the function might
 * run multiple times (cDU etc) so a toggle would open then close
 *
 * @param {Object} options optional options to pass to reducer
 * @param {String} options.view The view you want the panel to load in, currently only 'ticket' works
 *
 * @example
 * openSupportPanel() // opens in default mode
 * openSupportPanel({ view: 'ticket' }) // opens in ticket mode
 */
export function openSupportPanel(options) {
  return {
    type: 'OPEN_SUPPORT_PANEL',
    payload: options
  };
}

/**
 * Creates a support ticket with a subject, message, and optional file attachment
 *
 * @param {Object} data
 * @param {String} data.issueType
 * @param {String} data.subject
 * @param {String} data.message
 * @param {Object} data.attachment
 * @param {String} data.attachment.filename
 * @param {Base64 String} data.attachment.content
 *
 */
export function createTicket({ issueType, ...data }) {
  return sparkpostApiRequest({
    type: 'CREATE_TICKET',
    meta: {
      method: 'POST',
      url: '/integrations/support/ticket',
      data: {
        ...data,
        issue_type: issueType
      }
    }
  });
}

// Opens support ticket form and fills values if provided
export function openSupportTicketForm({ issueId, message } = {}) {

  return (dispatch, getState) => {
    // this action assumes access control is ready when called, because
    // selectSupportIssues uses AC state to decide on what issues are visible
    const visibleIssues = selectSupportIssues(getState());
    const issue = _.find(visibleIssues, { id: issueId });

    // the support panel must be open before you can hydrate it
    dispatch(openSupportPanel({ view: 'ticket' }));

    if (issue) {
      dispatch(change(formName, 'issueId', issueId));
    }

    if (message) {
      dispatch(change(formName, 'message', message));
    }
  };
}
