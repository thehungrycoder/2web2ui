/* eslint max-lines: ["error", 200] */
import {
  convertStatus,
  selectTrackingDomainsAreLoaded,
  selectTrackingDomainsList,
  selectUnverifiedTrackingDomains,
  selectVerifiedTrackingDomains,
  selectVerifiedTrackingDomainsOptions,
  selectDefaultTrackingDomainOption,
  selectTrackingDomainsOptions
} from '../trackingDomains';

describe('Selectors: Tracking Domains', () => {
  let testDomains;

  beforeEach(() => {
    testDomains = [
      { domain: '0.com', status: { verified: true, compliance_status: 'valid' }, default: true, subaccount_id: 101 },
      { domain: '1.com', status: { verified: true, compliance_status: 'valid' }},
      { domain: '2.com', status: { verified: false, compliance_status: 'blocked' }},
      { domain: '3.com', status: { verified: false, compliance_status: 'valid' }},
      { domain: '4.com', status: { verified: true, compliance_status: 'valid' }, default: true }
    ];
  });

  describe('convertStatus', () => {

    it('should return the compliance status if not valid', () => {
      expect(convertStatus({ compliance_status: 'notvalid' })).toEqual('notvalid');
    });

    it('should return unverified if compliance status is valid and verified is false', () => {
      const state = {
        compliance_status: 'valid',
        verified: false
      };
      expect(convertStatus(state)).toEqual('unverified');
    });

    it('should return verified if compliance status is valid and verified is true', () => {
      const state = {
        compliance_status: 'valid',
        verified: true
      };
      expect(convertStatus(state)).toEqual('verified');
    });

  });

  describe('selectTrackingDomainsAreLoaded', () => {

    it('should return true if list is present and empty', () => {
      const state = {
        trackingDomains: {
          list: []
        }
      };
      expect(selectTrackingDomainsAreLoaded(state)).toEqual(true);
    });

    it('should return true if list is present and full', () => {
      const state = {
        trackingDomains: {
          list: testDomains
        }
      };
      expect(selectTrackingDomainsAreLoaded(state)).toEqual(true);
    });

    it('should return false if list is absent', () => {
      const state = {
        trackingDomains: {}
      };
      expect(selectTrackingDomainsAreLoaded(state)).toEqual(false);
    });

  });

  describe('selectTrackingDomainsList', () => {

    it('should return an empty array if list is not present', () => {
      const state = {
        trackingDomains: {}
      };
      expect(selectTrackingDomainsList(state)).toEqual([]);
    });

    it('should return a transformed array if list is present', () => {
      const state = {
        trackingDomains: {
          list: testDomains
        }
      };
      expect(selectTrackingDomainsList(state)).toMatchSnapshot();
    });

  });

  describe('selectUnverifiedTrackingDomains', () => {

    it('should return a list of unverified domains', () => {
      const state = {
        trackingDomains: {
          list: testDomains
        }
      };
      expect(selectUnverifiedTrackingDomains(state)).toMatchSnapshot();
    });

    it('should return an empty array when the list is absent', () => {
      const state = {
        trackingDomains: {}
      };
      expect(selectUnverifiedTrackingDomains(state)).toEqual([]);
    });
  });

  describe('selectVerifiedTrackingDomains', () => {
    it('should return a list of verified domains', () => {
      const state = {
        trackingDomains: {
          list: testDomains
        }
      };
      expect(selectVerifiedTrackingDomains(state, {})).toMatchSnapshot();
    });

    it('should return an empty array when the list is absent', () => {
      const state = {
        trackingDomains: {}
      };
      expect(selectVerifiedTrackingDomains(state, {})).toEqual([]);
    });

    it('should return only tracking domains assigned to subaccount', () => {
      testDomains[0].subaccount_id = 100;
      testDomains[1].subaccount_id = 101;
      testDomains[3].subaccount_id = 101;

      const state = {
        trackingDomains: {
          list: testDomains
        }
      };

      expect(selectVerifiedTrackingDomains(state, { domain: { subaccount_id: 101 }})).toMatchSnapshot();

    });
  });

  describe('selectVerifiedTrackingDomainsOptions', () => {
    it('should return a list of tracking domains formatted as options', () => {
      const state = {
        trackingDomains: {
          list: testDomains
        }
      };
      expect(selectVerifiedTrackingDomainsOptions(state, {})).toMatchSnapshot();
    });

  });

  describe('selectDefaultTrackingDomainsOptions', () => {
    it('should return the default domain when specified', () => {
      const state = {
        trackingDomains: {
          list: testDomains
        }
      };
      expect(selectDefaultTrackingDomainOption(state, {})).toMatchSnapshot();
    });

    it('should return system default when no default options', () => {
      testDomains.pop(); // remove the default domain
      const state = {
        trackingDomains: {
          list: testDomains
        }
      };
      expect(selectDefaultTrackingDomainOption(state, {})).toMatchSnapshot();
    });
  });

  describe('selectTrackingDomainsOptions', () => {
    it('should return default and all verified tracking domain options', () => {
      const state = {
        trackingDomains: {
          list: testDomains
        }
      };
      expect(selectTrackingDomainsOptions(state, {})).toMatchSnapshot();
    });
  });
});
