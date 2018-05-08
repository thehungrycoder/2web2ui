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
 *     condition: isEnterprise()
 *   }
 */
const supportIssues = [
  {
    id: 'technical_errors',
    label: 'Technical errors',
    messageLabel: 'Tell us more about your issue',
    type: ERRORS
  },
  {
    id: 'general_billing',
    label: 'Billing problems',
    messageLabel: 'Tell us more about your billing issue',
    type: BILLING
  },
  {
    id: 'account_cancellation',
    label: 'Account cancellation',
    messageLabel: 'Tell us why you are leaving',
    type: COMPLIANCE
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
    id: 'general_issue',
    label: 'Another issue',
    messageLabel: 'Tell us more about your issue',
    type: SUPPORT
  }
];

export default supportIssues;
