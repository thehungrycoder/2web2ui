// GET /account/countries

export default () => ({
  results: [
    {
      name: 'United States',
      code: 'US',
      states: [
        { name: 'Maryland', code: 'MD' }
      ]
    }
  ]
});
