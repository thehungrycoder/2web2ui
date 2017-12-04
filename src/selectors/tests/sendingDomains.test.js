import { selectVerifiedDomains, selectReadyForBounce, readyFor } from '../sendingDomains';

describe('Selectors: sendingDomains', () => {
  const state = {
    sendingDomains: {
      list: [
        {
          status: {
            ownership_verified: true,
            compliance_status: 'valid'
          }
        },
        {
          status: {
            ownership_verified: false,
            compliance_status: 'valid',
            mx_status: 'valid',
            cname_status: 'invalid',
            dkim_status: 'valid'
          }
        },
        {
          status: {
            ownership_verified: true,
            compliance_status: 'invalid',
            mx_status: 'invalid',
            cname_status: 'valid',
            dkim_status: 'invalid'
          }
        }
      ]
    }
  };

  it('should return all verified domains', () => {
    expect(selectVerifiedDomains(state)).toMatchSnapshot();
  });

  it('should return all domains ready for bounce domains', () => {
    expect(selectReadyForBounce(state)).toMatchSnapshot();
  });

});

