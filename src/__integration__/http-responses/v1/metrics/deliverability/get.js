// GET /metrics/deliverability
// NOTE: this is currently specialised for actions/brightback.js

export default () => ({
  results: [{
    count_sent: 101,
    count_unique_confirmed_opened_approx: 10,
    count_accepted: 42
  }]
});
