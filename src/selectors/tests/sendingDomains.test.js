import { selectVerifiedDomains, selectReadyForBounce, hasUnverifiedDomains, selectDomain } from '../sendingDomains';

describe('Selectors: sendingDomains', () => {
  const state = {
    sendingDomains: {
      domain: {
        dkim: {
          selector: 'scph0118',
          public: '123456789A'
        }
      },
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

  const props = {
    match: { params: { id: 'xyz.com' }}
  };

  it('should append DKIM keys to domain object', () => {
    expect(selectDomain(state, props)).toMatchSnapshot();
  });

  it('should return all verified domains', () => {
    expect(selectVerifiedDomains(state)).toMatchSnapshot();
  });

  it('should return all domains ready for bounce domains', () => {
    expect(selectReadyForBounce(state)).toMatchSnapshot();
  });

  describe('has unverified domains', () => {
    it('should return true if there are unverified sending domains', () => {
      expect(hasUnverifiedDomains(state)).toEqual(true);
    });

    it('should return false if there are no unverified sending domains', () => {
      const state = {
        sendingDomains: {
          list: [
            {
              status: {
                ownership_verified: true,
                compliance_status: 'valid'
              }
            }
          ]
        }
      };
      expect(hasUnverifiedDomains(state)).toEqual(false);
    });

    it('should return false if there are no domains', () => {
      const state = {
        sendingDomains: {
          list: []
        }
      };
      expect(hasUnverifiedDomains(state)).toEqual(false);
    });
  });

});
