import _ from 'lodash';

import { hasOnlineSupport, hasStatus, hasStatusReasonCategory, isSuspendedForBilling } from 'src/helpers/conditions/account';
import { all, not, any } from 'src/helpers/conditions';
import { isAdmin } from 'src/helpers/conditions/user';

// types of support issues
// @note These values must be configured in Desk before being used and they are case-sensitive
const BILLING = 'Billing';
const COMPLIANCE = 'Compliance';
const ERRORS = 'Errors';
const LIMITS = 'DailyLimits';
const SUPPORT = 'Support';

const defaultCondition = all(hasOnlineSupport, hasStatus('active'));
const idConditionsMap = {
  general_billing: all(isAdmin, any(isSuspendedForBilling, hasStatus('active'))),
  account_suspension: all(hasStatus('suspended'), not(hasStatusReasonCategory('100.01'))),
  account_cancellation: isAdmin
};


/**
 * @example
 *   {
 *     // a snake cased string, used to reference a specific issue
 *     id: 'example_issue',
 *
 *     // the label for the support form dropdown
 *     label: 'This is an example',
 *
 *     // the follow-up question for the support form
 *     messageLabel: 'Tell us more about your issue',
 *
 *     type: 'Example',
 *
 *   }
 */
const supportIssues = [
  {
    id: 'ui_errors',
    label: 'UI errors',
    messageLabel: 'Tell us more about your issue',
    type: ERRORS
  },
  {
    id: 'sending_domain_block',
    label: 'Sending domain block',
    messageLabel: 'Tell us more about your issue',
    type: COMPLIANCE
  },
  {
    id: 'configuration_setup_support',
    label: 'Configuration support',
    messageLabel: 'Tell us more about your issue',
    type: SUPPORT
  },
  {
    id: 'dns',
    label: 'DNS help',
    messageLabel: 'Tell us more about your issue',
    type: SUPPORT
  },
  {
    id: 'placement_deliverability',
    label: 'Deliverability issues',
    messageLabel: 'Tell us more about your issue',
    type: SUPPORT
  },
  {
    id: 'reporting_and_event_issue',
    label: 'Reporting & event issues',
    messageLabel: 'Tell us more about your issue',
    type: SUPPORT
  },
  {
    id: 'blacklisting',
    label: 'IP blacklisting',
    messageLabel: 'Tell us more about your issue',
    type: COMPLIANCE
  },
  {
    id: 'product/support_feedback',
    label: 'Feedback',
    messageLabel: 'Tell us more about your issue',
    type: SUPPORT
  },
  {
    id: 'account_upgrade/downgrade_issue',
    label: 'Account upgrade/downgrade issues',
    messageLabel: 'Tell us more about your issue',
    type: SUPPORT
  },
  {
    id: 'general_billing',
    label: 'Billing problems',
    messageLabel: 'Tell us more about your billing issue',
    type: BILLING
  },
  {
    id: 'account_suspension',
    label: 'Account suspension',
    messageLabel: 'Why do you think your account should be unsuspended?',
    type: COMPLIANCE
  },
  {
    id: 'daily_limits',
    label: 'Daily sending limit increase',
    messageLabel: 'What limit do you need and why?',
    type: LIMITS
  },
  {
    id: 'account_cancellation',
    label: 'Account cancellation',
    messageLabel: 'Tell us why you are leaving',
    type: COMPLIANCE
  },
  {
    id: 'general_issue',
    label: 'Another issue',
    messageLabel: 'Tell us more about your issue',
    type: SUPPORT
  }
];


const augmentIssuesWithConditions = function () {
  return _.map(supportIssues, (supportIssue) => ({
    ...supportIssue,
    condition: supportIssue.condition || idConditionsMap[supportIssue.id] || defaultCondition
  }));
};

export default augmentIssuesWithConditions();
