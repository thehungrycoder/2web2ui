// GET /ip-pools
export default () => ({
  results: [
    {
      id: 'default',
      name: 'Default',
      customer_provided: false,
      ips: [{ external_ip: '10.0.0.17', hostname: 'ten.zero.zero.seventeen' }]
    }
  ]
});
