// GET /account

export default ({ params }) => {
  const account = {
    anniversary_date: '2018-05-01T08:00:00.000Z',
    company_name: null,
    country_code: '',
    created: '2018-04-13T03:07:48.627Z',
    options: {
      smtp_tracking_default: false,
      ui: {}
    },
    service_level: 'standard',
    status: 'active',
    status_reason_category: '',
    status_updated: '2018-04-13T03:07:48.627Z',
    updated: '2018-06-12T02:16:30.576Z',
    subscription: {
      code: '50K-0817',
      name: '50K',
      plan_volume: 50000,
      self_serve: true,
      type: 'default'
    },
    support: {
      phone: true,
      online: true
    }
  };
  if (typeof params.include === 'string' && params.include.includes('billing')) {
    account.billing = {
      first_name: null,
      last_name: null,
      address1: null,
      address2: null,
      city: null,
      state: 'MD',
      country_code: 'US',
      zip_code: '12345',
      email: 'test-email@sparkpost.test',
      credit_card: {
        id: '2c92c0fb63ed6e0a0163f1c7bec25b52',
        type: 'Visa',
        number: '************1111',
        expiration_month: 4,
        expiration_year: 2022
      }
    };
  }
  return { results: account };
};
