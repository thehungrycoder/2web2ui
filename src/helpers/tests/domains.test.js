import * as domains from '../domains';

describe('resolveReadyFor', () => {
  it('should return correct values', () => {
    const status = {
      ownership_verified: true,
      cname_status: 'valid',
      dkim_status: 'valid',
      mx_status: 'valid'
    }
    expect(domains.resolveReadyFor(status)).toMatchSnapshot();
  });
});

describe('resolveStatus', () => {
  it('should return unverified if not ownership verified', () => {
    const status = {
      ownership_verified: false,
      compliance_status: 'valid'
    };

    expect(domains.resolveStatus(status)).toEqual('unverified');
  });

  it('should return verified if valid', () => {
    const status = {
      ownership_verified: true,
      compliance_status: 'valid'
    };

    expect(domains.resolveStatus(status)).toEqual('verified');
  });

  it('should return compliance status', () => {
    const status = {
      ownership_verified: true,
      compliance_status: 'blocked'
    };

    expect(domains.resolveStatus(status)).toEqual('blocked');
  });
});
