// GET /sending-ips
export default () => ({
  results: [
    { external_ip: '10.0.0.17', hostname: 'ten.zero.zero.seventeen', ip_pool: 'default', customer_provided: false },
    { external_ip: '10.0.0.23', hostname: 'ten.zero.zero.twentythree', ip_pool: 'newPool', customer_provided: false }
  ]
});
