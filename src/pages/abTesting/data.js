import moment from 'moment';

export default [
  {
    id: 'user-invite',
    name: 'User Invite',
    version: 1,
    status: 'draft',
    metric: 'count_unique_confirmed_opened',
    audience_selection: 'percent',
    test_mode: 'bayesian',
    confidence_level: 0.99,
    engagement_timeout: 24,
    default_template: {
      template_id: 'default_user_invite_template',
      percent: 60
    },
    variants: [
      {
        template_id: 'user_invite_variant1',
        percent: 10
      },
      {
        template_id: 'user_invite_variant2',
        percent: 30
      }
    ],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'payment-confirmation',
    name: 'Payment Confirmation',
    version: 2,
    status: 'scheduled',
    metric: 'count_unique_confirmed_opened',
    audience_selection: 'sample_size',
    start_time: new Date(),
    end_time: moment().add(30, 'days'),
    test_mode: 'learning',
    engagement_timeout: 24,
    total_sample_size: 90,
    default_template: {
      template_id: 'default_payment_confirmation_template',
      sample_size: 30
    },
    variants: [
      {
        template_id: 'payment_confirmation_variant1',
        sample_size: 30
      },
      {
        template_id: 'payment_confirmation_variant2',
        sample_size: 30
      }
    ],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'password-reset',
    name: 'Password Reset Test',
    version: 3,
    status: 'cancelled',
    metric: 'count_unique_confirmed_opened',
    audience_selection: 'percent',
    start_time: new Date(),
    end_time: moment().add(30, 'days'),
    test_mode: 'bayesian',
    confidence_level: 0.99,
    engagement_timeout: 24,
    default_template: {
      template_id: 'default_password_reset_template',
      percent: 60
    },
    variants: [
      {
        template_id: 'password_reset_variant1',
        percent: 10
      },
      {
        template_id: 'password_reset_variant2',
        percent: 30
      }
    ],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'welcome-message',
    name: 'Welcome Message',
    version: 3,
    status: 'running',
    metric: 'count_unique_confirmed_opened',
    audience_selection: 'percent',
    start_time: new Date(),
    end_time: moment().add(30, 'days'),
    test_mode: 'bayesian',
    confidence_level: 0.99,
    engagement_timeout: 24,
    default_template: {
      template_id: 'default_welcome-message_template',
      percent: 60
    },
    variants: [
      {
        template_id: 'welcome-message_variant1',
        percent: 10
      },
      {
        template_id: 'welcome-message_variant2',
        percent: 30
      }
    ],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'billing-alert',
    name: 'Billing Alert',
    version: 4,
    status: 'completed',
    metric: 'count_unique_confirmed_opened',
    audience_selection: 'percent',
    start_time: new Date(),
    end_time: moment().add(30, 'days'),
    test_mode: 'bayesian',
    confidence_level: 0.99,
    engagement_timeout: 24,
    winning_template_id: 'billing-alert_variant1',
    default_template: {
      template_id: 'default_billing-alert_template',
      percent: 60,
      count_unique_confirmed_opened: 1000,
      count_accepted: 100000,
      engagement_rate: 0.01
    },
    variants: [
      {
        template_id: 'billing-alert_variant1',
        percent: 10,
        count_unique_confirmed_opened: 489,
        count_accepted: 9000,
        engagement_rate: 0.054333
      },
      {
        template_id: 'billing-alert_variant2',
        percent: 30,
        count_unique_confirmed_opened: 320,
        count_accepted: 68933,
        engagement_rate: 0.004642
      }
    ],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'billing-alert-2-no-winner',
    name: 'Billing Alert 2',
    version: 2,
    status: 'completed',
    metric: 'count_unique_confirmed_opened',
    audience_selection: 'percent',
    start_time: new Date(),
    end_time: moment().add(30, 'days'),
    test_mode: 'bayesian',
    confidence_level: 0.99,
    engagement_timeout: 24,
    winning_template_id: 'default_billing-alert_template',
    default_template: {
      template_id: 'default_billing-alert_template',
      percent: 60
    },
    variants: [
      {
        template_id: 'billing-alert_variant1',
        percent: 10
      },
      {
        template_id: 'billing-alert_variant2',
        percent: 30
      }
    ],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'billing-alert',
    name: 'Billing Alert',
    version: 2,
    status: 'completed',
    metric: 'count_unique_confirmed_opened',
    audience_selection: 'percent',
    start_time: new Date(),
    end_time: moment().add(30, 'days'),
    test_mode: 'bayesian',
    confidence_level: 0.99,
    engagement_timeout: 24,
    default_template: {
      template_id: 'default_billing-alert_template',
      percent: 60
    },
    variants: [
      {
        template_id: 'billing-alert_variant1',
        percent: 10
      },
      {
        template_id: 'billing-alert_variant2',
        percent: 30
      }
    ],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'billing-alert',
    name: 'Billing Alert',
    version: 2,
    status: 'completed',
    metric: 'count_unique_confirmed_opened',
    audience_selection: 'percent',
    start_time: new Date(),
    end_time: moment().add(30, 'days'),
    test_mode: 'bayesian',
    confidence_level: 0.99,
    engagement_timeout: 24,
    default_template: {
      template_id: 'default_billing-alert_template',
      percent: 60
    },
    variants: [
      {
        template_id: 'billing-alert_variant1',
        percent: 10
      },
      {
        template_id: 'billing-alert_variant2',
        percent: 30
      }
    ],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'billing-alert',
    name: 'Billing Alert',
    version: 2,
    status: 'completed',
    metric: 'count_unique_confirmed_opened',
    audience_selection: 'percent',
    start_time: new Date(),
    end_time: moment().add(30, 'days'),
    test_mode: 'bayesian',
    confidence_level: 0.99,
    engagement_timeout: 24,
    default_template: {
      template_id: 'default_billing-alert_template',
      percent: 60
    },
    variants: [
      {
        template_id: 'billing-alert_variant1',
        percent: 10
      },
      {
        template_id: 'billing-alert_variant2',
        percent: 30
      }
    ],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'billing-alert',
    name: 'Billing Alert',
    version: 2,
    status: 'completed',
    metric: 'count_unique_confirmed_opened',
    audience_selection: 'percent',
    start_time: new Date(),
    end_time: moment().add(30, 'days'),
    test_mode: 'bayesian',
    confidence_level: 0.99,
    engagement_timeout: 24,
    default_template: {
      template_id: 'default_billing-alert_template',
      percent: 60
    },
    variants: [
      {
        template_id: 'billing-alert_variant1',
        percent: 10
      },
      {
        template_id: 'billing-alert_variant2',
        percent: 30
      }
    ],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'billing-alert',
    name: 'Billing Alert',
    version: 2,
    status: 'completed',
    metric: 'count_unique_confirmed_opened',
    audience_selection: 'percent',
    start_time: new Date(),
    end_time: moment().add(30, 'days'),
    test_mode: 'bayesian',
    confidence_level: 0.99,
    engagement_timeout: 24,
    default_template: {
      template_id: 'default_billing-alert_template',
      percent: 60
    },
    variants: [
      {
        template_id: 'billing-alert_variant1',
        percent: 10
      },
      {
        template_id: 'billing-alert_variant2',
        percent: 30
      }
    ],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'billing-alert',
    name: 'Billing Alert',
    version: 2,
    status: 'completed',
    metric: 'count_unique_confirmed_opened',
    audience_selection: 'percent',
    start_time: new Date(),
    end_time: moment().add(30, 'days'),
    test_mode: 'bayesian',
    confidence_level: 0.99,
    engagement_timeout: 24,
    default_template: {
      template_id: 'default_billing-alert_template',
      percent: 60
    },
    variants: [
      {
        template_id: 'billing-alert_variant1',
        percent: 10
      },
      {
        template_id: 'billing-alert_variant2',
        percent: 30
      }
    ],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'billing-alert',
    name: 'Billing Alert',
    version: 2,
    status: 'completed',
    metric: 'count_unique_confirmed_opened',
    audience_selection: 'percent',
    start_time: new Date(),
    end_time: moment().add(30, 'days'),
    test_mode: 'bayesian',
    confidence_level: 0.99,
    engagement_timeout: 24,
    default_template: {
      template_id: 'default_billing-alert_template',
      percent: 60
    },
    variants: [
      {
        template_id: 'billing-alert_variant1',
        percent: 10
      },
      {
        template_id: 'billing-alert_variant2',
        percent: 30
      }
    ],
    created_at: new Date(),
    updated_at: new Date()
  }
]
