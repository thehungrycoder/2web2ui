import qs from 'query-string';
import lookup from './responses';

const defaultResponse = {
  data: {
    success: true,
    results: []
  }
}

export const singleton = jest.fn((request) => {
  const response = lookup(request);
  // let response;
  return Promise.resolve(response ? response : defaultResponse);
});

const mock = {
  create: () => singleton
};

export default mock;
