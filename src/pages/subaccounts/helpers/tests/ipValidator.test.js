import ipValidator from '../ipValidator';
import cases from 'jest-in-case';

const VALID_CASES = {
  'with no value': { value: undefined },
  'with an empty string': { value: '' },
  'with a valid IP address': { value: '10.20.30.40' },
  'with many valid IP addresses': { value: '10.20.30.40, 10.20.30.0/24' }
};

cases('returns undefined', ({ value }) => {
  expect(ipValidator(value)).toBeUndefined();
}, VALID_CASES);


const INVALID_CASES = {
  'with an invalid IP address': { value: 'invalid.ip' },
  'with some valid IP addresses': { value: '10.20.30.40, invalid.ip, 10.20.30.0/24' }
};

cases('returns error message with random string', ({ value }) => {
  expect(ipValidator(value)).toMatch(/must be a comma separated list/i);
}, INVALID_CASES);
