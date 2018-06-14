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
  })
};

export default ({ method, url, ...rest }) => {
  const response = responses[`${method.toUpperCase()} ${url}`];
  if (response) {
    return { data: response(rest) };
  }
}
