import { selectVerifiedDomains, selectReadyForBounce, selectDkimVerifiedDomains, hasUnverifiedDomains, selectDomain, selectNotBlockedDomains } from '../sendingDomains';

describe('Selectors: sendingDomains', () => {
  let state;

  beforeEach(() => {
    state = {
      sendingDomains: {
        domain: {
          id: 'xyz.com',
          dkim: {
            selector: 'scph0118',
            public: '123456789A'
          }
        },
        list: [
          {
            domain: 'owner-verified.test',
            status: {
              ownership_verified: true,
              compliance_status: 'valid'
            }
          },
          {
            domain: 'dkim-verified.test',
            status: {
              ownership_verified: false,
              compliance_status: 'valid',
              mx_status: 'valid',
              cname_status: 'invalid',
              dkim_status: 'valid'
            }
          },
          {
            domain: 'compliance-verified.test',
            status: {
              ownership_verified: true,
              compliance_status: 'pending',
              mx_status: 'invalid',
              cname_status: 'valid',
              dkim_status: 'invalid'
            }
          },
          {
            domain: 'verified-but-blocked.test',
            status: {
              ownership_verified: true,
              compliance_status: 'blocked',
              mx_status: 'valid',
              cname_status: 'valid',
              dkim_status: 'valid'
            }
          }
        ]
      }
    };
  });

  it('should append DKIM keys to domain object', () => {
    expect(selectDomain(state)).toMatchSnapshot();
  });

  it('should use signing domain when present for DKIM hostname', () => {
    state.sendingDomains.domain.dkim.signing_domain = 'iamsigning.edu';
    expect(selectDomain(state)).toMatchSnapshot();
  });

  it('should return all verified domains', () => {
    expect(selectVerifiedDomains(state)).toMatchSnapshot();
  });

  it('should return all domains ready for bounce domains', () => {
    expect(selectReadyForBounce(state)).toMatchSnapshot();
  });

  it('should return all domains that are dkim verified', () => {
    expect(selectDkimVerifiedDomains(state)).toMatchSnapshot();
  });

  it('should return all domains that are not blocked', () => {
    expect(selectNotBlockedDomains(state)).toMatchSnapshot();
  });

  describe('has unverified domains', () => {
    it('should return true if there are unverified sending domains', () => {
      expect(hasUnverifiedDomains(state)).toEqual(true);
    });

    it('should return false if there are no unverified sending domains', () => {
      const state = {
        sendingDomains: {
          list: [
            { status: { ownership_verified: true, compliance_status: 'valid' }},
            { status: { ownership_verified: true, compliance_status: 'blocked' }}
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
