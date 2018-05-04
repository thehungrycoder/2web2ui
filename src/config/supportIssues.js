// types of support issues
const BILLING = 'Billing';
const COMPLIANCE = 'Compliance';
const ERRORS = 'Errors';
const LIMITS = 'Limits';
const SUPPORT = 'Support';

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
