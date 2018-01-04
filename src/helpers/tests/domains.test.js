import * as domains from '../domains';

describe('resolveReadyFor', () => {
  it('should return correct values', () => {
    expect(domains.resolveReadyFor({ ownership_verified: true }).sending).toBeTruthy();
    expect(domains.resolveReadyFor({ ownership_verified: false }).sending).toBeFalsy();
    expect(domains.resolveReadyFor({ dkim_status: 'valid' }).dkim).toBeTruthy();
    expect(domains.resolveReadyFor({ dkim_status: 'invalid' }).dkim).toBeFalsy();
    expect(domains.resolveReadyFor({ cname_status: 'valid' }).bounce).toBeTruthy();
    expect(domains.resolveReadyFor({ cname_status: 'invalid' }).bounce).toBeFalsy();
    expect(domains.resolveReadyFor({ mx_status: 'valid' }).bounce).toBeTruthy();
    expect(domains.resolveReadyFor({ mx_status: 'invalid' }).bounce).toBeFalsy();
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
