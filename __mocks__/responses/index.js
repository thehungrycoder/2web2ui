const responses = {
  'GET /account/countries': () => ({
    results: [
      {
        name: 'United States',
        code: 'US',
        states: [
          { name: 'Maryland', code: 'MD' }
        ]
      }
    ]
  }),
  'POST /account/cors-data': ({ params }) => ({
    results: {
      signature: params.context + '__signature',
      token: params.context + '__token'
    }
  }),
  'GET /account': ({ params }) => {
    const account = {
      anniversary_date: "2018-05-01T08:00:00.000Z",
      company_name: null,
      country_code: "",
      created: "2018-04-13T03:07:48.627Z",
      options: {
        smtp_tracking_default: false,
        ui: {}
      },
      service_level: "standard",
      status: "active",
      status_reason_category: "",
      status_updated: "2018-04-13T03:07:48.627Z",
      updated: "2018-06-12T02:16:30.576Z",
      subscription: {
        code: "50K-0817",
        name: "50K",
        plan_volume: 50000,
        self_serve: true,
        type: "default"
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
        state: "MD",
        country_code: "US",
        zip_code: "12345",
        email: "test-email@sparkpost.test",
        credit_card: {
           id: "2c92c0fb63ed6e0a0163f1c7bec25b52",
           type: "Visa",
           number: "************1111",
           expiration_month: 4,
           expiration_year: 2022
        }
      };
    }
    return { results: account };
  },
  'GET /account/plans': () => ({
    results: [
      { code: 'free-0817', name: 'Free', status: 'public', volume: 100, monthly: 0 },
      { code: '50K-0817', name: '50K', status: 'public', volume: 50000, monthly: 9, billingId: '50k-billingid' },
      { code: 'large', name: 'Largo', status: 'public', volume: 3500000, monthly: 149, billingId: 'largo-billingid' }
    ]
  })
};

export default ({ method, url, ...rest }) => {
  const response = responses[`${method.toUpperCase()} ${url}`];
  if (response) {
    return { data: response(rest) };
  }
}
