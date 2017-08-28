const config = {
  apiBase: 'no-default-set',
  apiDateFormat: 'YYYY-MM-DDTHH:mm',
  apiRequestTimeout: 10000,
  authentication: {
    cookie: {
      name: 'auth',
      options: {
        path: '/'
      }
    },
    headers: {
      Authorization: 'Basic bXN5c1dlYlVJOmZhODZkNzJlLTYyODctNDUxMy1hZTdmLWVjOGM4ZmEwZDc2Ng==',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  chartColors: ['#20578E', '#F38415', '#45A6FF', '#FFD300', '#41B5AB', '#6BEAA8'],
  metricsPrecisionMap: [
    { time: 60, value: '1min', format: 'ha' },
    { time: 60 * 2, value: '5min', format: 'ha' },
    { time: 60 * 4, value: '15min', format: 'ha' },
    { time: 60 * 24 * 2, value: 'hour', format: 'ha' },
    { time: 60 * 24 * 7, value: '12hr', format: 'MMM Do' },
    { time: 60 * 24 * 33, value: 'day', format: 'MMM Do' },
    { time: 60 * 24 * 190, value: 'week', format: 'MMM Do' },
    { time: Infinity, value: 'month', format: 'MMM YY' }
  ]
};

export default config;
