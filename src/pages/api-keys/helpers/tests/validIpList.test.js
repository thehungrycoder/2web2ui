import validIpList from '../validIpList';

test('empty values are valid', () => {
  expect(validIpList()).toBeUndefined();
});

test('single ips are valid', () => {
  expect(validIpList('1.2.3.4')).toBeUndefined();
  expect(validIpList('192.168.1.1')).toBeUndefined();
  expect(validIpList('10.20.30.40/24')).toBeUndefined();
});

test('lists of ips are valid', () => {
  expect(validIpList('1.2.3.4, 192.168.1.1')).toBeUndefined();
  expect(validIpList('1.2.3.4,192.168.1.1')).toBeUndefined();
  expect(validIpList('1.2.3.4,                  192.168.1.1')).toBeUndefined();
});

test('non-ips are not valid', () => {
  expect(validIpList('foo')).toMatch('valid IPs');
  expect(validIpList('1.2.3.4, bar')).toMatch('valid IPs');
  expect(validIpList('1.2.3.4.192.168')).toMatch('valid IPs');
});
