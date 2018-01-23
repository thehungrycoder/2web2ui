import { encodeIp, decodeIp } from '../ipNames';

describe('ipNames helper tests', () => {
  it('should encode ip correctly', () => {
    expect(encodeIp('127.0.0.1')).toEqual('127_0_0_1');
  });

  it('should decode ip correctly', () => {
    expect(decodeIp('127_0_0_1')).toEqual('127.0.0.1');
  });
});
