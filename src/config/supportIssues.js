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
 *     // optional, composed account helpers to determine which user can report this issue
 *     condition: isEnterprise
 *   }
 */
const supportIssues = [
  {
    id: 'ui_errors',
    label: 'UI errors',
    messageLabel: 'Tell us more about your issue',
    type: ERRORS,
    condition: all(hasOnlineSupport, hasStatus('active'))
  },
  {
    id: 'sending_domain_block',
    label: 'Sending domain block',
    messageLabel: 'Tell us more about your issue',
    type: COMPLIANCE,
    condition: all(hasOnlineSupport, hasStatus('active'))
  },
  {
    id: 'configuration_setup_support',
    label: 'Configuration support',
    messageLabel: 'Tell us more about your issue',
    type: SUPPORT,
    condition: all(hasOnlineSupport, hasStatus('active'))
  },
  {
    id: 'dns',
    label: 'DNS help',
    messageLabel: 'Tell us more about your issue',
    type: SUPPORT,
    condition: all(hasOnlineSupport, hasStatus('active'))
  },
  {
    id: 'placement_deliverability',
    label: 'Deliverability issues',
    messageLabel: 'Tell us more about your issue',
    type: SUPPORT,
    condition: all(hasOnlineSupport, hasStatus('active'))
  },
  {
    id: 'reporting_and_event_issue',
    label: 'Reporting & event issues',
    messageLabel: 'Tell us more about your issue',
    type: SUPPORT,
    condition: all(hasOnlineSupport, hasStatus('active'))
  },
  {
    id: 'blacklisting',
    label: 'IP blacklisting',
    messageLabel: 'Tell us more about your issue',
    type: COMPLIANCE,
    condition: all(hasOnlineSupport, hasStatus('active'))
  },
  {
    id: 'product/support_feedback',
    label: 'Feedback',
    messageLabel: 'Tell us more about your issue',
    type: SUPPORT,
    condition: all(hasOnlineSupport, hasStatus('active'))
  },
  {
    id: 'account_upgrade/downgrade_issue',
    label: 'Account upgrade/downgrade issues',
    messageLabel: 'Tell us more about your issue',
    type: SUPPORT,
    condition: all(hasOnlineSupport, hasStatus('active'))
  },
  {
    id: 'general_billing',
    label: 'Billing problems',
    messageLabel: 'Tell us more about your billing issue',
    type: BILLING,
    condition: all(isAdmin, any(isSuspendedForBilling, hasStatus('active')))
  },
  {
    id: 'account_suspension',
    label: 'Account suspension',
    messageLabel: 'Why do you think your account should be unsuspended?',
    type: COMPLIANCE,
    condition: all(hasStatus('suspended'), not(hasStatusReasonCategory('100.01')))
  },
  {
    id: 'daily_limits',
    label: 'Daily sending limit increase',
    messageLabel: 'What limit do you need and why?',
    type: LIMITS,
    condition: all(hasOnlineSupport, isAdmin, hasStatus('active'))
  },
  {
    id: 'account_cancellation',
    label: 'Account cancellation',
    messageLabel: 'Tell us why you are leaving',
    type: COMPLIANCE,
    condition: isAdmin
  },
  {
    id: 'general_issue',
    label: 'Another issue',
    messageLabel: 'Tell us more about your issue',
    type: SUPPORT,
    condition: all(hasOnlineSupport, hasStatus('active'))
  }
];

export default supportIssues;
